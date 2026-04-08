"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ROPRESUPUESTO_FILTER_FIELDS } from "@/lib/ropresupuesto-filter-options"
import type { RopresupuestoTablaFilters } from "@/lib/ropresupuesto-tabla"
import { Filter } from "lucide-react"
import { useEffect, useState } from "react"

type Props = {
  pageSize: number
  filters: RopresupuestoTablaFilters
  onApply: (filters: RopresupuestoTablaFilters) => void
}

export function DocumentosFiltersCard({ pageSize, filters, onApply }: Props) {
  const [draft, setDraft] = useState<RopresupuestoTablaFilters>(filters)
  useEffect(() => {
    setDraft(filters)
  }, [filters])

  return (
    <Card className="rounded-2xl border border-border/80 bg-muted/25 shadow-none">
      <CardHeader className="border-b border-border/70 pb-4">
        <CardTitle className="text-base font-black tracking-tight text-(--color-brand-primary)">
          Filtros globales
        </CardTitle>
        <CardDescription>La tabla usa estos filtros y vuelve a página 1 al aplicar.</CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onApply(draft)
          }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          <input type="hidden" value={String(pageSize)} />
          {ROPRESUPUESTO_FILTER_FIELDS.map((field) => {
            const current = draft[field.param]
            const inCatalog =
              current !== undefined &&
              (field.options as readonly string[]).includes(current)
            return (
              <label key={field.param} className="grid gap-1.5">
                <span className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
                  {field.label}
                </span>
                <select
                  className="h-11 w-full cursor-pointer rounded-xl border border-input bg-background px-3 text-sm font-semibold text-(--color-brand-primary) outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  aria-label={field.label}
                  value={current ?? ""}
                  onChange={(event) => {
                    const value = event.target.value.trim()
                    setDraft((prev) => {
                      if (!value) {
                        const next = { ...prev }
                        delete next[field.param]
                        return next
                      }
                      return { ...prev, [field.param]: value }
                    })
                  }}
                >
                  <option value="">Todos</option>
                  {current !== undefined && !inCatalog ? (
                    <option value={current}>{current}</option>
                  ) : null}
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            )
          })}
          <div className="flex items-end sm:col-span-2 lg:col-span-3 xl:col-span-1">
            <button
              type="submit"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-(--color-brand-primary) px-4 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Filter className="size-4 shrink-0" aria-hidden />
              Aplicar filtros
            </button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="border-t border-border/80 text-xs text-muted-foreground">
        Al aplicar filtros se reinicia a la página 1.
      </CardFooter>
    </Card>
  )
}
