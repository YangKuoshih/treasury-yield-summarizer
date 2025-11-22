"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw, ExternalLink } from "lucide-react"
import type { TreasuryYield } from "@/lib/types"

interface YieldSpecificSummaryProps {
  selectedYield: TreasuryYield | null
}

interface NewsSummary {
  news: Array<{ title: string; url: string; source: string }>
  economicSummary: string[]
  generatedAt: string
}

export function YieldSpecificSummary({ selectedYield }: YieldSpecificSummaryProps) {
  const [summary, setSummary] = useState<NewsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const generateSummary = async () => {
    if (!selectedYield) return

    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("https://rvscg1wvg5.execute-api.us-east-1.amazonaws.com/yield-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yield: selectedYield }),
      })

      if (!res.ok) throw new Error("Failed to generate summary")

      const data = await res.json()
      setSummary(data)
    } catch (err) {
      setError("Failed to generate analysis.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedYield) {
      generateSummary()
    } else {
      setSummary(null)
    }
  }, [selectedYield])

  if (!selectedYield) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex h-[300px] items-center justify-center text-center">
          <div className="text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a yield from the Market Rates table to see AI-powered analysis and related news</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>{selectedYield.maturity} Treasury Yield Analysis</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={generateSummary} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>Current yield: {selectedYield.yield.toFixed(2)}%</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : summary ? (
          <div className="space-y-6">
            {/* Economic Summary */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Economic Insights</h4>
              <ul className="space-y-2">
                {summary.economicSummary.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            {/* Related News */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Related News</h4>
              <div className="space-y-2">
                {summary.news.map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm p-3 rounded-md bg-background hover:bg-muted/50 border transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.source}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="text-xs text-muted-foreground pt-2 border-t">
              Generated at: {new Date(summary.generatedAt).toLocaleTimeString()}
            </div>
          </div>
        ) : (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Sparkles className="h-8 w-8 animate-pulse text-primary/50" />
                <span>Analyzing {selectedYield.maturity} yield data...</span>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
