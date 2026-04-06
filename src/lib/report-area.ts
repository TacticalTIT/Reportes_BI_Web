export const REPORT_AREAS = ["control_previo", "ro_civil"] as const

export type ReportArea = (typeof REPORT_AREAS)[number]

export function isReportArea(v: unknown): v is ReportArea {
  return v === "control_previo" || v === "ro_civil"
}

export const REPORT_AREA_LABEL: Record<ReportArea, string> = {
  control_previo: "CONTROL PREVIO R.O",
  ro_civil: "REPORTE R.O CIVIL",
}
