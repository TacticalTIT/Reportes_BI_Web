import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { TooltipProvider } from "@/components/ui/tooltip"
import { REPORT_AREA_LABEL } from "@/lib/report-area"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }
  const reportArea = session.user.reportArea
  if (!reportArea) {
    redirect("/login")
  }

  return (
    <TooltipProvider>
      <SidebarProvider data-app-sidebar="light">
        <AppSidebar user={session.user} reportArea={reportArea} />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
            <SidebarTrigger className="-ml-1 md:hidden" />
            <Separator orientation="vertical" className="mr-2 h-6 md:hidden" />
            <span
              className="inline-flex max-w-[min(100%,20rem)] items-center rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-center text-[0.7rem] font-semibold uppercase leading-tight tracking-wide text-primary"
              title="Área de trabajo activa"
            >
              {REPORT_AREA_LABEL[reportArea]}
            </span>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
