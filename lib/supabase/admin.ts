// New file: lib/supabase/admin.ts
// For server-side operations requiring admin privileges (like NextAuth adapter or direct DB writes)
import { createClient } from "@supabase/supabase-js"

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key
)
