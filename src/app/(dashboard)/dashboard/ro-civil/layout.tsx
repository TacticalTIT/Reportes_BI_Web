import { auth } from "@/auth"
import { defaultDashboardPath } from "@/lib/nav-by-area"
import { redirect } from "next/navigation"

export default async function RoCivilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const area = session?.user?.reportArea
  if (area !== "ro_civil") {
    redirect(area ? defaultDashboardPath(area) : "/login")
  }
  return children
}
