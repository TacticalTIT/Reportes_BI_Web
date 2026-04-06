import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { isReportArea } from "@/lib/report-area"

/** bcrypt en .env se rompe con dotenv-expand ($2b se interpreta como variable). Usar AUTH_DEMO_PASSWORD_HASH_B64. */
function resolveDemoPasswordHash(): string | undefined {
  const b64 = process.env.AUTH_DEMO_PASSWORD_HASH_B64?.trim()
  if (b64) {
    try {
      return Buffer.from(b64, "base64").toString("utf8")
    } catch {
      return undefined
    }
  }
  const legacy = process.env.AUTH_DEMO_PASSWORD_HASH?.trim()
  return legacy?.replace(/^["']|["']$/g, "") || undefined
}

const config = {
  trustHost: true,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      id: "credentials",
      name: "Credenciales",
      credentials: {
        username: { label: "Usuario" },
        password: { label: "Contraseña", type: "password" },
      },
      authorize: async (credentials) => {
        const username = credentials?.username as string | undefined
        const password = credentials?.password as string | undefined
        if (!username?.trim() || !password) return null

        const expectedUser = process.env.AUTH_DEMO_USERNAME
        const hash = resolveDemoPasswordHash()
        if (!expectedUser || !hash) {
          console.error(
            "Falta AUTH_DEMO_USERNAME o AUTH_DEMO_PASSWORD_HASH_B64 (o HASH legado) en el entorno."
          )
          return null
        }

        if (username !== expectedUser) return null
        const { default: bcrypt } = await import("bcryptjs")
        const valid = await bcrypt.compare(password, hash)
        if (!valid) return null

        return {
          id: "1",
          name: username,
          email: `${username}@local`,
        }
      },
    }),
  ],
  callbacks: {
    authorized({ request, auth }) {
      const path = request.nextUrl.pathname
      if (path === "/") {
        if (!auth?.user) {
          return Response.redirect(new URL("/login", request.nextUrl))
        }
        if (!auth.user.reportArea) {
          return Response.redirect(new URL("/login", request.nextUrl))
        }
        return Response.redirect(new URL("/dashboard", request.nextUrl))
      }
      if (path === "/login") {
        if (auth?.user?.reportArea) {
          return Response.redirect(new URL("/dashboard", request.nextUrl))
        }
        return true
      }
      if (path.startsWith("/dashboard")) {
        if (!auth?.user) return false
        if (!auth.user.reportArea) {
          return Response.redirect(new URL("/login", request.nextUrl))
        }
        return true
      }
      return true
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id
        token.name = user.name
        token.email = user.email
        if (user.reportArea) token.reportArea = user.reportArea
      }
      if (trigger === "update" && session && "reportArea" in session) {
        const next = session.reportArea
        if (isReportArea(next)) token.reportArea = next
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.name = (token.name as string) ?? session.user.name
        session.user.email = (token.email as string) ?? session.user.email
        const ra = token.reportArea
        session.user.reportArea = isReportArea(ra) ? ra : undefined
      }
      return session
    },
  },
} satisfies NextAuthConfig

export const { handlers, signIn, signOut, auth } = NextAuth(config)
