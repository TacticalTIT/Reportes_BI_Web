export default function AyudaPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Ayuda</h1>

      <p className="text-muted-foreground">
        Guia rapida para usar el sistema de forma simple y ordenada.
      </p>

      <section className="space-y-2">
        <h2 className="text-base font-medium">Que puedes hacer aqui</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Ver indicadores y reportes de tus modulos.</li>
          <li>Filtrar informacion por rango de fechas y criterios.</li>
          <li>Revisar resultados y tomar decisiones rapidamente.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-medium">Pasos rapidos</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Ingresa al modulo que necesitas consultar.</li>
          <li>Selecciona filtros basicos, como periodo o proyecto.</li>
          <li>Revisa la informacion principal en pantalla.</li>
          <li>Si hace falta, ajusta filtros para afinar el resultado.</li>
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-medium">Recomendaciones</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Confirma siempre el rango de fechas antes de analizar datos.</li>
          <li>Compara periodos para detectar cambios importantes.</li>
          <li>Si algo no cuadra, contacta al equipo de soporte.</li>
        </ul>
      </section>
    </div>
  )
}
