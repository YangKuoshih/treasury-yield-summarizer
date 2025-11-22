"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, RefreshCw, AlertTriangle, TrendingUp, Minus } from "lucide-react"
import type { AISummary, TreasuryYield } from "@/lib/types"

interface AISummaryPanelProps {
  yields: TreasuryYield[]
}

export function AISummaryPanel({ yields }: AISummaryPanelProps) {
  const [summary, setSummary] = useState<AISummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const generateSummary = async () => {
    if (yields.length === 0) return

    setIsLoading(true)
    setError("")
    try {
      const res = await fetch("https://rvscg1wvg5.execute-api.us-east-1.amazonaws.com/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yields }),
      })

      if (!res.ok) throw new Error("Failed to generate summary")

      const data = await res.json()
      setSummary(data)
    } catch (err) {
      setError("Failed to generate AI analysis.")
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-generate summary when data is available and no summary exists
  useEffect(() => {
    if (yields.length > 0 && !summary && !isLoading) {
      generateSummary()
    }
  }, [yields])

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case "inverted":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "steep":
        return <TrendingUp className="h-5 w-5 text-success" />
      case "flat":
        return <Minus className="h-5 w-5 text-warning" />
      default:
        return <TrendingUp className="h-5 w-5 text-primary" />
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "inverted":
        return "destructive"
      case "steep":
        return "default" // success mapped to default/primary in badge usually
      case "flat":
        return "secondary" // warning mapped to secondary
      default:
        return "outline"
    }
  }

  return (
    <Card className="col-span-1 md:col-span-3 border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Market Analysis</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={generateSummary} disabled={isLoading || yields.length === 0}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
        </div>
        <CardDescription>Powered by AWS Bedrock Claude 4.5 Sonnet</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : summary ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Market Condition:</span>
              <Badge
                variant={getConditionColor(summary.marketCondition) as any}
                className="capitalize flex gap-1 items-center"
              >
                {getConditionIcon(summary.marketCondition)}
                {summary.marketCondition}
              </Badge>
            </div>

            <div className="rounded-md bg-background p-4 text-sm leading-relaxed border">{summary.summary}</div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Key Insights</h4>
              <ul className="space-y-1">
                {summary.keyInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
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
                <span>Analyzing market data...</span>
              </div>
            ) : (
              "Waiting for data..."
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
