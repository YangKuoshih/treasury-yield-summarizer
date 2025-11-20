import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime"
import type { AISummary, TreasuryYield } from "./types"

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
})

const MODEL_ID = process.env.BEDROCK_MODEL_ID || "anthropic.claude-4-5-sonnet-20250220-v1:0"

export async function generateYieldSummary(yields: TreasuryYield[]): Promise<AISummary> {
  const yieldDataString = yields.map((y) => `${y.maturityLabel}: ${y.value}%`).join(", ")

  const prompt = `
    You are a senior fixed income analyst. Analyze the following U.S. Treasury yield curve data:
    ${yieldDataString}

    Provide a concise summary of the current market conditions.
    
    Format your response as a JSON object with the following structure:
    {
      "summary": "A 2-3 sentence executive summary of the yield curve shape and implications.",
      "keyInsights": ["Insight 1", "Insight 2", "Insight 3"],
      "marketCondition": "normal" | "inverted" | "steep" | "flat"
    }
    
    Focus on:
    1. The shape of the curve (inverted, flat, steep)
    2. Key spreads (2s10s, 3m10s)
    3. Implications for the economy (recession risk, growth outlook)
  `

  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  }

  try {
    const command = new InvokeModelCommand({
      modelId: MODEL_ID,
      body: JSON.stringify(payload),
      contentType: "application/json",
    })

    const response = await client.send(command)
    const responseBody = JSON.parse(new TextDecoder().decode(response.body))

    // Parse the content from Claude's response
    const contentText = responseBody.content[0].text

    // Extract JSON from the response (in case Claude adds extra text)
    const jsonMatch = contentText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from AI response")
    }

    const parsedData = JSON.parse(jsonMatch[0])

    return {
      ...parsedData,
      generatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Bedrock API Error:", error)
    // Fallback for demo/error cases
    return {
      summary: "Unable to generate AI summary at this time. Please try again later.",
      keyInsights: ["Data analysis unavailable"],
      marketCondition: "normal",
      generatedAt: new Date().toISOString(),
    }
  }
}
