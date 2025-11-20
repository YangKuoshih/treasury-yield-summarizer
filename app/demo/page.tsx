"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { YieldCurveChart } from "@/components/dashboard/yield-curve-chart"
import { YieldTable } from "@/components/dashboard/yield-table"
import { AISummaryPanel } from "@/components/dashboard/ai-summary-panel"
import type { YieldCurveData } from "@/lib/types"
import { RefreshCw, ArrowRight } from "lucide-react"

export default function DemoPage() {
  const [data, setData] = useState<YieldCurveData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchData = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("/api/treasury/yields")
      if (!res.ok) throw new Error("Failed to fetch data")
      const jsonData = await res.json()
      setData(jsonData)
    } catch (err) {
      setError("Failed to load Treasury data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-muted/10">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <span className="hidden sm:inline-block">Treasury Yield Summarizer</span>
            <span className="sm:hidden">TYS</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Demo</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={fetchData} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline-block">Refresh</span>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Market Dashboard (Public Demo)</h1>
          <p className="text-muted-foreground">
            Real-time analysis of U.S. Treasury yield curves. This is a read-only demo view.
          </p>
        </div>

        {error && <div className="rounded-md bg-destructive/10 p-4 text-destructive">{error}</div>}

        <div className="grid gap-6 md:grid-cols-3">
          <YieldCurveChart data={data?.yields || []} date={data?.date || ""} isLoading={isLoading} />
          <YieldTable data={data?.yields || []} isLoading={isLoading} />

          <AISummaryPanel yields={data?.yields || []} />
        </div>
      </main>
    </div>
  )
}
