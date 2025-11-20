import { NextResponse } from "next/server"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"

// Initialize DynamoDB Client
// In production (Amplify), credentials are auto-injected via IAM role or env vars
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
})
const docClient = DynamoDBDocumentClient.from(client)

export async function GET() {
  try {
    const tableName = process.env.DYNAMODB_TABLE_DATA || "treasury-yield-summarizer-data"
    const today = new Date().toISOString().split("T")[0]

    // Query DynamoDB for today's data
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "#date = :date AND #type = :type",
      ExpressionAttributeNames: {
        "#date": "date",
        "#type": "type",
      },
      ExpressionAttributeValues: {
        ":date": today,
        ":type": "yield_curve",
      },
    })

    const response = await docClient.send(command)
    const item = response.Items?.[0]

    if (item) {
      return NextResponse.json({
        yields: item.yields,
        date: item.date,
      })
    }

    // If no data for today, try yesterday (fallback logic could be more robust)
    // For now, return empty or trigger Lambda (not implemented here to avoid latency)
    return NextResponse.json({
      yields: [],
      date: today,
      message: "No data available for today yet.",
    })
  } catch (error) {
    console.error("Error fetching yield curve:", error)
    return NextResponse.json({ error: "Failed to fetch yield curve data" }, { status: 500 })
  }
}
