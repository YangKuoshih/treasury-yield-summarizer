import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { docClient, TABLE_SESSIONS } from "@/lib/db"
import { DeleteCommand } from "@aws-sdk/lib-dynamodb"

export async function POST() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (sessionToken) {
    try {
      // Delete session from DynamoDB
      await docClient.send(new DeleteCommand({
        TableName: TABLE_SESSIONS,
        Key: { sessionToken },
      }))
    } catch (error) {
      console.error("Error deleting session:", error)
    }
  }

  cookieStore.delete("session_token")
  return NextResponse.json({ success: true })
}
