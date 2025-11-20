import { NextResponse } from "next/server"
import { docClient, TABLE_USERS, TABLE_SESSIONS } from "@/lib/db"
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Get user
    const getCommand = new GetCommand({
      TableName: TABLE_USERS,
      Key: { email },
    })
    const result = await docClient.send(getCommand)
    const user = result.Item

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    const sessionToken = uuidv4()
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week

    // Store session in DynamoDB
    // Note: DynamoDB TTL usually expects seconds (Unix timestamp)
    const ttl = Math.floor(expires.getTime() / 1000)

    await docClient.send(new PutCommand({
      TableName: TABLE_SESSIONS,
      Item: {
        sessionToken,
        email: user.email,
        userId: user.userId,
        expires: ttl,
      },
    }))

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expires,
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: { id: user.userId, email: user.email },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
