import type { NextApiRequest, NextApiResponse } from 'next'
import type { TreasuryYield } from '@/lib/types'

// FRED API series IDs for Treasury yields
const SERIES_IDS = {
  '1 Mo': 'DGS1MO',
  '3 Mo': 'DGS3MO', 
  '6 Mo': 'DGS6MO',
  '1 Yr': 'DGS1',
  '2 Yr': 'DGS2',
  '5 Yr': 'DGS5',
  '10 Yr': 'DGS10',
  '30 Yr': 'DGS30'
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const fredApiKey = process.env.FRED_API_KEY
    if (!fredApiKey) {
      return res.status(500).json({ error: 'FRED API key not configured' })
    }

    const yields: TreasuryYield[] = []
    
    // Fetch data for each maturity
    for (const [maturity, seriesId] of Object.entries(SERIES_IDS)) {
      try {
        const response = await fetch(
          `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${fredApiKey}&file_type=json&limit=1&sort_order=desc`
        )
        
        if (!response.ok) continue
        
        const data = await response.json()
        const observations = data.observations || []
        
        if (observations.length > 0 && observations[0].value !== '.') {
          yields.push({
            maturity,
            yield: parseFloat(observations[0].value),
            seriesId
          })
        }
      } catch (error) {
        console.error(`Error fetching ${maturity} yield:`, error)
        continue
      }
    }

    res.status(200).json({ yields, date: new Date().toISOString() })
  } catch (error) {
    console.error('Error fetching Treasury yields:', error)
    res.status(500).json({ error: 'Failed to fetch Treasury yields' })
  }
}