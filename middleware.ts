// New file: middleware.ts
export { default } from "next-auth/middleware"

export const config = {
  // Matches all routes except those starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - /sign-in (the sign-in page itself)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sign-in).*)"],
}
