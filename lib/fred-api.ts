import type { TreasuryYield } from "./types"

const FRED_API_KEY = process.env.FRED_API_KEY
const BASE_URL = "https://api.stlouisfed.org/fred/series/observations"

// Series IDs for Treasury Constant Maturities
const SERIES_IDS = {
  DGS1MO: { label: "1 Mo", months: 1 },
  DGS3MO: { label: "3 Mo", months: 3 },
  DGS6MO: { label: "6 Mo", months: 6 },
  DGS1: { label: "1 Yr", months: 12 },
  DGS2: { label: "2 Yr", months: 24 },
  DGS5: { label: "5 Yr", months: 60 },
  DGS10: { label: "10 Yr", months: 120 },
  DGS20: { label: "20 Yr", months: 240 },
  DGS30: { label: "30 Yr", months: 360 },
}

export async function fetchCurrentYieldCurve(): Promise<TreasuryYield[]> {
  // If no API key is present, return mock data for preview/demo purposes
  if (!FRED_API_KEY) {
    console.warn("No FRED_API_KEY found, returning mock data")
    return getMockYieldData()
  }

  try {
    const promises = Object.entries(SERIES_IDS).map(async ([seriesId, info]) => {
      const url = `${BASE_URL}?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=1`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch ${seriesId}: ${response.statusText}`)
      }

      const data = await response.json()
      const observation = data.observations?.[0]

      if (!observation) return null

      // Handle "." which FRED uses for missing data (holidays, weekends)
      const value = observation.value === "." ? 0 : Number.parseFloat(observation.value)

      return {
        id: seriesId,
        date: observation.date,
        value: value,
        maturityLabel: info.label,
        maturityMonths: info.months,
      }
    })

    const results = await Promise.all(promises)

    // Filter out nulls and sort by maturity
    return results
      .filter((item): item is TreasuryYield => item !== null && item.value > 0)
      .sort((a, b) => a.maturityMonths - b.maturityMonths)
  } catch (error) {
    console.error("Error fetching FRED data:", error)
    return getMockYieldData()
  }
}

function getMockYieldData(): TreasuryYield[] {
  const today = new Date().toISOString().split("T")[0]
  return [
    { id: "DGS1MO", date: today, value: 5.42, maturityLabel: "1 Mo", maturityMonths: 1 },
    { id: "DGS3MO", date: today, value: 5.38, maturityLabel: "3 Mo", maturityMonths: 3 },
    { id: "DGS6MO", date: today, value: 5.25, maturityLabel: "6 Mo", maturityMonths: 6 },
    { id: "DGS1", date: today, value: 4.95, maturityLabel: "1 Yr", maturityMonths: 12 },
    { id: "DGS2", date: today, value: 4.65, maturityLabel: "2 Yr", maturityMonths: 24 },
    { id: "DGS5", date: today, value: 4.28, maturityLabel: "5 Yr", maturityMonths: 60 },
    { id: "DGS10", date: today, value: 4.25, maturityLabel: "10 Yr", maturityMonths: 120 },
    { id: "DGS20", date: today, value: 4.52, maturityLabel: "20 Yr", maturityMonths: 240 },
    { id: "DGS30", date: today, value: 4.4, maturityLabel: "30 Yr", maturityMonths: 360 },
  ]
}
