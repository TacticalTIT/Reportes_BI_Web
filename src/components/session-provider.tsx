"use client"

import type { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

export function AuthSessionProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <SessionProvider basePath="/api/auth" session={session}>
      {children}
    </SessionProvider>
  )
}
