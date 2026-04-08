"use client"

import { cn } from "@/lib/utils"

type PaginationShape = {
  page: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
  prevPage: number | null
  nextPage: number | null
  visiblePages: number[]
}

type Props = {
  pagination: PaginationShape
  onPageChange: (page: number) => void
}

export function DocumentosPaginationNav({
  pagination,
  onPageChange,
}: Props) {
  const { page, totalPages, hasPrev, hasNext, prevPage, nextPage, visiblePages } =
    pagination

  return (
    <nav
      className="flex flex-wrap items-center gap-2"
      aria-label="Paginación"
    >
      {hasPrev && prevPage != null ? (
        <button
          type="button"
          onClick={() => onPageChange(prevPage)}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
        >
          Anterior
        </button>
      ) : (
        <span className="rounded-lg border border-transparent px-3 py-1.5 text-sm text-muted-foreground opacity-50">
          Anterior
        </span>
      )}
      <div className="flex flex-wrap gap-1">
        {visiblePages.map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "flex size-8 items-center justify-center rounded-md text-sm font-medium",
              p === page
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 hover:bg-muted"
            )}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}
      </div>
      {hasNext && nextPage != null ? (
        <button
          type="button"
          onClick={() => onPageChange(nextPage)}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
        >
          Siguiente
        </button>
      ) : (
        <span className="rounded-lg border border-transparent px-3 py-1.5 text-sm text-muted-foreground opacity-50">
          Siguiente
        </span>
      )}
      <span className="text-xs text-muted-foreground tabular-nums sm:ml-1">
        {page} / {totalPages}
      </span>
    </nav>
  )
}
