// New file: lib/auth.ts
import type { NextAuthOptions, User as NextAuthUser } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"

interface CustomUser extends NextAuthUser {
  id: string // Ensure id is always string
  // Add any other custom properties you expect on the user object
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for adapter
  }),
  session: {
    strategy: "jwt", // Using JWT for session strategy
  },
  callbacks: {
    async session({ session, token }) {
      // The token object contains the JWT payload
      // Ensure the session.user object gets the id from the token (which comes from the JWT `sub` claim)
      if (token && session.user) {
        ;(session.user as CustomUser).id = token.sub as string // token.sub is the user's ID from the provider
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      // This callback is called whenever a JWT is created or updated.
      // `user` is only passed on initial sign-in.
      if (user) {
        token.id = user.id // Persist the user id to the token
      }
      return token
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in", // Redirect to custom sign-in page
  },
}
