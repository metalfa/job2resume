// New file: app/api/stripe/webhooks/route.ts
import Stripe from "stripe"
import { supabaseAdmin } from "@/lib/supabase/admin"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
])

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("Stripe-Signature") as string | null

  if (!sig) {
    return new Response("Missing Stripe signature", { status: 400 })
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session
          if (session.mode === "subscription" && session.subscription && session.customer) {
            const subscriptionId = session.subscription.toString()
            const customerId = session.customer.toString()
            const userId = session.metadata?.userId

            if (!userId) {
              console.error("Webhook Error: userId not found in session metadata", session.id)
              break
            }

            // Fetch subscription details to get current_period_end
            const subscription = await stripe.subscriptions.retrieve(subscriptionId)

            await supabaseAdmin
              .from("users")
              .update({
                subscription_status: "active",
                stripe_subscription_id: subscriptionId,
                stripe_customer_id: customerId,
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              })
              .eq("id", userId)
            console.log(`Subscription active for user ${userId}`)
          }
          break
        }
        case "customer.subscription.updated":
        case "customer.subscription.created": {
          // Also handle created for direct subscriptions or imports
          const subscription = event.data.object as Stripe.Subscription
          const customerId = subscription.customer.toString()
          const { data: user } = await supabaseAdmin
            .from("users")
            .select("id")
            .eq("stripe_customer_id", customerId)
            .single()

          if (user) {
            await supabaseAdmin
              .from("users")
              .update({
                subscription_status: subscription.status, // e.g., active, past_due, canceled
                stripe_subscription_id: subscription.id,
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              })
              .eq("id", user.id)
            console.log(`Subscription ${subscription.status} for user ${user.id}`)
          }
          break
        }
        case "customer.subscription.deleted": {
          // Handles cancellations
          const subscription = event.data.object as Stripe.Subscription
          const customerId = subscription.customer.toString()
          const { data: user } = await supabaseAdmin
            .from("users")
            .select("id")
            .eq("stripe_customer_id", customerId)
            .single()

          if (user) {
            await supabaseAdmin
              .from("users")
              .update({
                subscription_status: "cancelled", // Or 'inactive'
                // current_period_end will reflect when access ends
              })
              .eq("id", user.id)
            console.log(`Subscription cancelled for user ${user.id}`)
          }
          break
        }
        case "invoice.paid":
          // Could extend trial or grant access if payment for a new period
          const invoice = event.data.object as Stripe.Invoice
          if (invoice.subscription && invoice.billing_reason === "subscription_cycle") {
            const subscriptionId = invoice.subscription.toString()
            const subscription = await stripe.subscriptions.retrieve(subscriptionId)
            const { data: user } = await supabaseAdmin
              .from("users")
              .select("id")
              .eq("stripe_subscription_id", subscriptionId)
              .single()
            if (user) {
              await supabaseAdmin
                .from("users")
                .update({
                  subscription_status: "active",
                  current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                })
                .eq("id", user.id)
              console.log(`Subscription renewed for user ${user.id}`)
            }
          }
          break
        case "invoice.payment_failed":
          // Handle failed payments, maybe set status to 'past_due'
          const failedInvoice = event.data.object as Stripe.Invoice
          if (failedInvoice.subscription) {
            const subscriptionId = failedInvoice.subscription.toString()
            const { data: user } = await supabaseAdmin
              .from("users")
              .select("id")
              .eq("stripe_subscription_id", subscriptionId)
              .single()
            if (user) {
              await supabaseAdmin.from("users").update({ subscription_status: "past_due" }).eq("id", user.id)
              console.log(`Subscription payment failed for user ${user.id}`)
            }
          }
          break
        default:
          console.warn(`Unhandled relevant event type: ${event.type}`)
      }
    } catch (error) {
      console.error("Webhook handler error:", error)
      return new Response("Webhook handler error. View logs.", { status: 500 })
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
