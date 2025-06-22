// New file: lib/supabase/userActions.ts
import { supabaseAdmin } from "./admin" // Use admin client for direct DB modifications

export async function getUserSubscription(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("users") // Assuming your user details are in 'users' table linked by 'id'
    .select("trial_resumes_used, trial_cover_letters_used, subscription_status, stripe_customer_id, current_period_end")
    .eq("id", userId)
    .single()

  if (error) {
    console.error("Error fetching user subscription:", error)
    // Return a default trial state or throw error
    return { trial_resumes_used: 0, trial_cover_letters_used: 0, subscription_status: "free_trial" }
  }
  return data || { trial_resumes_used: 0, trial_cover_letters_used: 0, subscription_status: "free_trial" }
}

export async function updateTrialUsage(userId: string, type: "resume" | "cover_letter") {
  const { data: currentUserState, error: fetchError } = await supabaseAdmin
    .from("users")
    .select("trial_resumes_used, trial_cover_letters_used, subscription_status")
    .eq("id", userId)
    .single()

  if (fetchError || !currentUserState) {
    console.error("Error fetching user for trial update:", fetchError)
    throw new Error("Could not update trial usage.")
  }

  if (currentUserState.subscription_status === "active") {
    return currentUserState // Don't update trial if active subscription
  }

  let updatePayload = {}
  if (type === "resume") {
    updatePayload = { trial_resumes_used: (currentUserState.trial_resumes_used || 0) + 1 }
  } else {
    updatePayload = { trial_cover_letters_used: (currentUserState.trial_cover_letters_used || 0) + 1 }
  }

  const { data: updatedUser, error: updateError } = await supabaseAdmin
    .from("users")
    .update(updatePayload)
    .eq("id", userId)
    .select("trial_resumes_used, trial_cover_letters_used, subscription_status")
    .single()

  if (updateError) {
    console.error("Error updating trial usage:", updateError)
    throw new Error("Could not update trial usage.")
  }
  return updatedUser
}
