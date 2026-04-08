"use client"

import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from "@tanstack/react-query"
import { useState } from "react"

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
}

export function AppQueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient(queryClientConfig))
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
