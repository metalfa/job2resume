// New file: app/api/stripe/checkout-session/route.ts
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"
import { supabaseAdmin } from "@/lib/supabase/admin" // Use admin for DB operations

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || !(session.user as any).id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const userId = (session.user as any).id
  const userEmail = session.user.email

  try {
    const { priceId } = await req.json()
    if (!priceId) {
      return new Response(JSON.stringify({ error: "Price ID is required" }), { status: 400 })
    }

    // Get or create Stripe customer
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("users")
      .select("stripe_customer_id")
      .eq("id", userId)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116: 0 rows
      console.error("Supabase error fetching profile:", profileError)
      throw profileError
    }

    let stripeCustomerId = userProfile?.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail!,
        metadata: { userId },
      })
      stripeCustomerId = customer.id
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", userId)
      if (updateError) throw updateError
    }

    const stripeSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/?session_id={CHECKOUT_SESSION_ID}`, // Redirect to dashboard
      cancel_url: `${process.env.NEXTAUTH_URL}/`, // Redirect to dashboard
      metadata: { userId },
    })

    return new Response(JSON.stringify({ sessionId: stripeSession.id }), { status: 200 })
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error)
    return new Response(JSON.stringify({ error: error.message || "Failed to create checkout session" }), {
      status: 500,
    })
  }
}
