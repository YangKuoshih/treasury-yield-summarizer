"use client"

import { useMemo } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { TreasuryYield } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface YieldCurveChartProps {
  data: TreasuryYield[]
  date: string
  isLoading?: boolean
  onSelectYield?: (yieldData: TreasuryYield) => void
}

export function YieldCurveChart({ data, date, isLoading, onSelectYield }: YieldCurveChartProps) {
  const chartData = useMemo(() => {
    const order = ["1 Mo", "2 Mo", "3 Mo", "6 Mo", "1 Yr", "2 Yr", "3 Yr", "5 Yr", "7 Yr", "10 Yr", "20 Yr", "30 Yr"];
    return data
      .sort((a, b) => order.indexOf(a.maturity) - order.indexOf(b.maturity))
      .map((item, index) => ({
        maturity: item.maturity,
        yield: item.yield,
        order: index
      }));
  }, [data])

  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 5];
    const yields = chartData.map(d => d.yield);
    const maxYield = Math.max(...yields);
    const padding = maxYield * 0.10; // 10% padding on top
    return [0, maxYield + padding];
  }, [chartData]);

  const isInverted = useMemo(() => {
    if (data.length < 2) return false
    const yield10Y = data.find((d) => d.maturity === "10 Yr")?.yield
    const yield2Y = data.find((d) => d.maturity === "2 Yr")?.yield
    return yield10Y !== undefined && yield2Y !== undefined && yield2Y > yield10Y
  }, [data])

  if (isLoading) {
    return (
      <Card className="col-span-2 h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    )
  }

  return (
    <Card className="col-span-2 h-full glass border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>U.S. Treasury Yield Curve</CardTitle>
            <CardDescription>
              Yields across maturities for {date ? new Date(date).toLocaleDateString() : "Latest"}
            </CardDescription>
          </div>
          {isInverted && (
            <div className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
              ⚠️ Inverted Curve (2Y/10Y)
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            yield: {
              label: "Yield (%)",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[400px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.4 0 0)" className="dark:stroke-[oklch(0.4_0_0)]" />
              <XAxis
                dataKey="maturity"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: "currentColor" }}
                className="text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value.toFixed(2)}%`}
                domain={yAxisDomain}
                tick={{ fill: "currentColor" }}
                className="text-muted-foreground"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="yield"
                strokeWidth={3}
                activeDot={{
                  r: 8,
                  onClick: (props: any) => {
                    if (onSelectYield && props.payload) {
                      // Recharts payload structure usually contains the data item directly or in payload.payload
                      const item = props.payload;
                      const yieldItem = data.find(d => d.maturity === item.maturity);
                      if (yieldItem) {
                        onSelectYield(yieldItem);
                      }
                    }
                  },
                  cursor: 'pointer'
                }}
                stroke="hsl(var(--chart-1))"
                dot={{
                  fill: "oklch(var(--chart-1))",
                  r: 4,
                  onClick: (props: any) => {
                    if (onSelectYield && props.payload) {
                      const item = props.payload;
                      const yieldItem = data.find(d => d.maturity === item.maturity);
                      if (yieldItem) {
                        onSelectYield(yieldItem);
                      }
                    }
                  },
                  cursor: 'pointer'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
