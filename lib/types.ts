export interface TreasuryYield {
  maturity: string // e.g., "1 Mo", "10 Yr"
  yield: number
  seriesId?: string
}

export interface YieldCurveData {
  yields: TreasuryYield[]
  date: string
}

export interface AISummary {
  summary: string
  keyInsights: string[]
  marketCondition: "normal" | "inverted" | "steep" | "flat"
  generatedAt: string
}

export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
}
