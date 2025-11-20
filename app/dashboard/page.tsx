"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { YieldCurveChart } from "@/components/dashboard/yield-curve-chart"
import { MarketRates } from "@/components/dashboard/market-rates"
import { AISummaryPanel } from "@/components/dashboard/ai-summary-panel" // Import new component
import type { YieldCurveData } from "@/lib/types"
import { LogOut, RefreshCw } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
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

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <span className="hidden sm:inline-block">Treasury Yield Summarizer</span>
            <span className="sm:hidden">TYS</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={fetchData} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline-block">Refresh</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline-block">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8 space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Market Dashboard</h1>
          <p className="text-muted-foreground">Real-time analysis of U.S. Treasury yield curves and market trends.</p>
        </div>

        {error && <div className="rounded-md bg-destructive/10 p-4 text-destructive">{error}</div>}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <YieldCurveChart data={data?.yields || []} date={data?.date || ""} isLoading={isLoading} />
          </div>
          <div className="md:col-span-1">
            <MarketRates yields={data?.yields || []} isLoading={isLoading} />
          </div>

          <AISummaryPanel yields={data?.yields || []} />
        </div>
      </main>
    </div>
  )
}
