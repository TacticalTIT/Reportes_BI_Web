import { NextRequest, NextResponse } from "next/server"

function backendBase(): string | null {
  const raw = process.env.REPORTES_API_BASE_URL?.replace(/\/$/, "")
  return raw && raw.length > 0 ? raw : null
}

/** Proxy → `GET /api/controlprevio/stockalmacen/toprecursos` */
export async function GET(request: NextRequest) {
  const base = backendBase()
  if (!base) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Falta REPORTES_API_BASE_URL en el servidor para el proxy de reportes.",
      },
      { status: 500 }
    )
  }

  const src = new URL(request.url)
  const upstreamUrl = `${base}/api/controlprevio/stockalmacen/toprecursos${src.search}`

  let res: Response
  try {
    res = await fetch(upstreamUrl, { cache: "no-store" })
  } catch {
    return NextResponse.json(
      { success: false, message: "No se pudo contactar el API de reportes." },
      { status: 502 }
    )
  }

  const body = await res.text()
  const contentType = res.headers.get("content-type") ?? "application/json"

  return new NextResponse(body, {
    status: res.status,
    headers: { "Content-Type": contentType },
  })
}
