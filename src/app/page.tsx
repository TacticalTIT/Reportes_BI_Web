/** La raíz redirige vía middleware según sesión; esta página es respaldo. */
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
      Redirigiendo…
    </div>
  )
}
