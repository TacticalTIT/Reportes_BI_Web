"use client"

import { useActionState, useId, useState } from "react"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { loginAction, type LoginState } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const initialState: LoginState = null

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)
  const [showPassword, setShowPassword] = useState(false)
  const usernameId = useId()
  const passwordId = useId()

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-4 duration-500 w-full rounded-3xl border border-border/80 bg-white p-8 shadow-[0_24px_80px_-24px_color-mix(in_srgb,var(--primary)_18%,transparent)] sm:p-10"
      )}
    >
      <div className="mb-8 space-y-2">
        <h1 className="font-heading text-[1.65rem] font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
          Bienvenido de nuevo
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Inicia sesión para continuar
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor={usernameId}>Usuario</Label>
          <div className="relative">
            <User
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id={usernameId}
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="su.usuario"
              disabled={pending}
              className="h-12 rounded-2xl border-input/90 bg-muted/30 pl-10 pr-4 text-base transition-colors focus-visible:border-primary/35 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/15 md:text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={passwordId}>Contraseña</Label>
          <div className="relative">
            <Lock
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id={passwordId}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              disabled={pending}
              className="h-12 rounded-2xl border-input/90 bg-muted/30 pl-10 pr-12 text-base transition-colors focus-visible:border-primary/35 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/15 md:text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-pressed={showPassword}
              aria-controls={passwordId}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-2.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-[1.15rem] shrink-0" aria-hidden />
              ) : (
                <Eye className="size-[1.15rem] shrink-0" aria-hidden />
              )}
            </button>
          </div>
        </div>

        {state?.error ? (
          <p className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={pending}
          className="h-12 w-full rounded-2xl text-base font-medium shadow-md transition-shadow hover:shadow-lg hover:brightness-[0.97]"
        >
          {pending ? "Entrando…" : "Entrar"}
        </Button>

        <div className="text-center">
          <button
            type="button"
            title="Contacte al administrador para restablecer su acceso"
            className="text-sm font-medium text-primary underline underline-offset-4 hover:brightness-110"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </form>
    </div>
  )
}
