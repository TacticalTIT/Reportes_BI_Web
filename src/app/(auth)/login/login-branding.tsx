"use client"

import * as React from "react"
import { Area, AreaChart, Cell, Pie, PieChart } from "recharts"
import { Check, Mail, type LucideIcon } from "lucide-react"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const lineData = [
  { mes: "E", u: 920 },
  { mes: "F", u: 1100 },
  { mes: "M", u: 1050 },
  { mes: "A", u: 1320 },
  { mes: "M", u: 1480 },
  { mes: "J", u: 1793 },
]

const lineConfig = {
  u: {
    label: "Usuarios activos",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig

const donutData = [
  { key: "a", name: "a", value: 32 },
  { key: "b", name: "b", value: 28 },
  { key: "c", name: "c", value: 22 },
  { key: "d", name: "d", value: 18 },
]

const donutConfig = {
  a: { label: "Serie A", color: "var(--color-chart-2)" },
  b: { label: "Serie B", color: "var(--color-chart-1)" },
  c: { label: "Serie C", color: "var(--color-chart-3)" },
  d: { label: "Serie D", color: "var(--color-chart-4)" },
} satisfies ChartConfig

function SteppedCorners() {
  return (
    <>
      <svg
        className="pointer-events-none absolute left-0 top-0 h-[min(55%,420px)] w-[min(55%,420px)] text-chart-5 opacity-50"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMinYMin slice"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0 0h44v44H0V0zm0 52h44v44H0V52zm0 52h44v44H0v-44zm52-104h44v44H52V0zm52 0h44v44h-44V0zm52 0h44v44h-44V0zM52 52h44v44H52V52zm52 0h44v44h-44V52zm52 0h44v44h-44V52zM104 104h44v44h-44v-44zm52 0h44v44h-44v-44z"
        />
      </svg>
      <svg
        className="pointer-events-none absolute bottom-0 right-0 h-[min(55%,420px)] w-[min(55%,420px)] text-chart-5 opacity-50"
        viewBox="0 0 200 200"
        preserveAspectRatio="xMaxYMax slice"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M200 200h-44v-44h44v44zm0-52h-44v-44h44v44zm0-52h-44v-44h44v44zm-52 104h-44v-44h44v44zm-52 0h-44v-44h44v44zm-52 0h-44v-44h44v44zm52-52h-44v-44h44v44zm-52 0h-44v-44h44v44zm-52 0h-44v-44h44v44zm-52-52h-44v-44h44v44zm-52 0h-44v-44h44v44z"
        />
      </svg>
    </>
  )
}

function DotGrid() {
  return (
    <div
      className="pointer-events-none absolute right-[18%] top-[22%] grid grid-cols-4 gap-1.5 opacity-35"
      aria-hidden
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="size-1.5 rounded-full bg-(--color-brand-tertiary)"
        />
      ))}
    </div>
  )
}

function TriangleCluster() {
  return (
    <div
      className="pointer-events-none absolute bottom-[32%] left-[12%] opacity-25"
      aria-hidden
    >
      <svg width="48" height="40" viewBox="0 0 48 40">
        <polygon
          points="24,4 40,32 8,32"
          fill="var(--color-brand-secondary)"
        />
        <polygon
          points="8,8 22,28 4,28"
          fill="var(--color-brand-tertiary)"
        />
      </svg>
    </div>
  )
}

function AvatarBubble({
  className,
  initial,
  icon: Icon,
}: {
  className?: string
  initial: string
  icon: LucideIcon
}) {
  return (
    <div
      className={cn(
        "absolute flex size-14 items-center justify-center rounded-full border-2 border-dashed border-white/55 bg-white/15 text-sm font-semibold text-white shadow-sm backdrop-blur-[2px]",
        className
      )}
    >
      <span className="absolute -top-0.5 flex size-5 items-center justify-center rounded-full bg-(--color-brand-tertiary) text-white ring-2 ring-white/40">
        <Icon className="size-2.5 text-white" strokeWidth={2.5} />
      </span>
      {initial}
    </div>
  )
}

export function LoginBranding() {
  const lineGradientId = React.useId().replace(/:/g, "")

  return (
    <div className="relative overflow-hidden bg-(--color-brand-primary) text-white lg:min-h-svh">
      <SteppedCorners />
      <DotGrid />
      <TriangleCluster />

      {/* Móvil */}
      <div className="relative z-1 flex flex-col items-center justify-center gap-2 px-4 py-8 lg:hidden">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-lg font-bold backdrop-blur-sm">
          BI
        </div>
        <p className="animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100 text-center text-sm font-medium text-white/90">
          Portal Reportes BI
        </p>
      </div>

      {/* Escritorio */}
      <div className="relative z-1 hidden min-h-svh flex-col justify-between p-10 pb-12 pt-14 lg:flex xl:p-14">
        <div className="relative mx-auto w-full max-w-md flex-1">
          <div
            className={cn(
              "animate-in fade-in slide-in-from-bottom-6 duration-700 absolute left-0 top-8 w-[min(100%,280px)] rounded-2xl bg-card p-4 text-card-foreground shadow-xl ring-1 ring-black/5"
            )}
          >
            <p className="mb-1 text-xs font-medium text-muted-foreground">
              Usuarios activos
            </p>
            <p className="mb-2 text-2xl font-semibold tabular-nums text-foreground">
              1.793
            </p>
            <ChartContainer config={lineConfig} className="h-[120px] w-full">
              <AreaChart data={lineData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id={lineGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-u)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-u)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="u"
                  stroke="var(--color-u)"
                  strokeWidth={2}
                  fill={`url(#${lineGradientId})`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </AreaChart>
            </ChartContainer>
          </div>

          <div
            className={cn(
              "animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 absolute right-0 top-[52%] w-[140px] rounded-2xl bg-card p-3 text-card-foreground shadow-xl ring-1 ring-black/5"
            )}
          >
            <p className="mb-1 text-[10px] font-medium text-muted-foreground">
              Por programa
            </p>
            <ChartContainer config={donutConfig} className="mx-auto aspect-square h-[100px] w-[100px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={28}
                  outerRadius={44}
                  strokeWidth={2}
                  stroke="var(--card)"
                >
                  {donutData.map((d) => (
                    <Cell key={d.key} fill={`var(--color-${d.name})`} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          <AvatarBubble
            className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 left-[8%] top-[48%]"
            initial="A"
            icon={Mail}
          />
          <AvatarBubble
            className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 right-[6%] top-[18%] size-12 text-xs"
            initial="L"
            icon={Check}
          />
          <AvatarBubble
            className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-[450ms] left-[42%] top-[6%] size-11 text-xs"
            initial="M"
            icon={Mail}
          />
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 mt-8 max-w-lg">
          <h2 className="text-3xl font-semibold tracking-tight xl:text-4xl">
            Portal Reportes BI
          </h2>
          <p className="mt-2 text-base text-white/80">
            Consulte y gestione el engagement con sus indicadores corporativos en
            un solo lugar.
          </p>
        </div>
      </div>
    </div>
  )
}
