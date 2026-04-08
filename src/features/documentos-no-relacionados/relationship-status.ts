export function relationshipStatus(value: string) {
  const v = value.trim().toLowerCase()
  if (!v || v === "no" || v === "false" || v === "0" || v === "n") return false
  return true
}
