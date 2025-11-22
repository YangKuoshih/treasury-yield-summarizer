import type { NextApiRequest, NextApiResponse } from 'next'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import type { TreasuryYield, AISummary } from '@/lib/types'

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { yields }: { yields: TreasuryYield[] } = req.body

    if (!yields || yields.length === 0) {
      return res.status(400).json({ error: 'No yield data provided' })
    }

    // Determine market condition
    const yield2Y = yields.find(y => y.maturity === '2 Yr')?.yield
    const yield10Y = yields.find(y => y.maturity === '10 Yr')?.yield
    let marketCondition: AISummary['marketCondition'] = 'normal'
    
    if (yield2Y && yield10Y) {
      const spread = yield10Y - yield2Y
      if (spread < 0) marketCondition = 'inverted'
      else if (spread > 2) marketCondition = 'steep'
      else if (spread < 0.5) marketCondition = 'flat'
    }

    const prompt = `Analyze the following U.S. Treasury yield data and provide insights:

${yields.map(y => `${y.maturity}: ${y.yield}%`).join('\n')}

Please provide:
1. A concise summary of the current yield curve shape and what it indicates about market conditions
2. Key insights about economic implications
3. Notable patterns or anomalies

Keep the response professional and focused on actionable insights for financial professionals.`

    const payload = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }

    const command = new InvokeModelCommand({
      modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-4-5-sonnet-20250220-v1:0',
      body: JSON.stringify(payload)
    })

    const response = await client.send(command)
    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    
    const summary: AISummary = {
      summary: responseBody.content[0].text,
      keyInsights: [
        `2Y/10Y Spread: ${yield2Y && yield10Y ? (yield10Y - yield2Y).toFixed(2) : 'N/A'}%`,
        `Curve Shape: ${marketCondition}`,
        `Highest Yield: ${Math.max(...yields.map(y => y.yield)).toFixed(2)}%`
      ],
      marketCondition,
      generatedAt: new Date().toISOString()
    }

    res.status(200).json(summary)
  } catch (error) {
    console.error('Error generating AI summary:', error)
    res.status(500).json({ error: 'Failed to generate AI summary' })
  }
}