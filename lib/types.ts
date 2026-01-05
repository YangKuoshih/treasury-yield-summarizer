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
  marketCondition: "normal" | "inverted" | "steep" | "flat" | "bullish" | "bearish" | "neutral"
  generatedAt: string
}

export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
}

export type CategoryId = 'interest_rates' | 'economic_growth' | 'inflation' | 'employment' | 'money_supply';

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface MetricData {
  label: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  unit?: string;
  trend?: TimeSeriesPoint[];
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
  summary?: string;
}

export interface CategoryData {
  id: CategoryId;
  name: string;
  lastUpdated: string;
  primaryMetric: MetricData;
  secondaryMetrics?: MetricData[];
  aiSummary?: AISummary;
  news?: NewsItem[];
  // Specific data fields
  yields?: TreasuryYield[]; // Only for interest_rates
}

export interface DailySnapshot {
  date: string;
  categories: Record<CategoryId, CategoryData>;
}
