import type { Metadata } from "next"
import { Geist_Mono, Poppins } from "next/font/google"
import { auth } from "@/auth"
import { AuthSessionProvider } from "@/components/session-provider"
import "./globals.css"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Reportes BI",
  description: "Dashboards y reportes corporativos",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html
      lang="es"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
      </body>
    </html>
  )
}
