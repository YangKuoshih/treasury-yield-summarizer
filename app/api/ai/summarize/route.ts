import { NextResponse } from "next/server"
import { generateYieldSummary } from "@/lib/bedrock"
import type { TreasuryYield } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const { yields } = await request.json()

    if (!yields || !Array.isArray(yields)) {
      return NextResponse.json({ error: "Invalid yield data provided" }, { status: 400 })
    }

    const summary = await generateYieldSummary(yields as TreasuryYield[])
    return NextResponse.json(summary)
  } catch (error) {
    console.error("Error generating summary:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
