export { auth as middleware } from "@/auth"

export const config = {
  matcher: ["/", "/login", "/dashboard", "/dashboard/:path*"],
}
