import { LoginBranding } from "./login-branding"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="min-h-svh grid grid-cols-1 lg:grid-cols-2">
      <LoginBranding />
      <div className="relative flex flex-col justify-center overflow-hidden bg-linear-to-b from-muted/50 via-white to-white px-4 py-10 sm:px-8 lg:px-10 xl:px-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, color-mix(in srgb, var(--primary) 8%, transparent) 0%, transparent 45%), radial-gradient(circle at 80% 90%, color-mix(in srgb, var(--ring) 10%, transparent) 0%, transparent 40%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
