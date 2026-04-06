import type { DefaultSession } from "next-auth"
import type { ReportArea } from "@/lib/report-area"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      reportArea?: ReportArea
    }
  }

  interface User {
    reportArea?: ReportArea
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    reportArea?: ReportArea
  }
}
