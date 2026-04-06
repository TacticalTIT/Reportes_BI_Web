import { auth } from "@/auth"
import { defaultDashboardPath } from "@/lib/nav-by-area"
import { redirect } from "next/navigation"

export default async function ControlPrevioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const area = session?.user?.reportArea
  if (area !== "control_previo") {
    redirect(area ? defaultDashboardPath(area) : "/login")
  }
  return children
}
