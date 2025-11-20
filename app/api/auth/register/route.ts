import { NextResponse } from "next/server"
import { docClient, TABLE_USERS } from "@/lib/db"
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Check if user exists
    const getCommand = new GetCommand({
      TableName: TABLE_USERS,
      Key: { email },
    })
    const existingUser = await docClient.send(getCommand)

    if (existingUser.Item) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = uuidv4()
    const now = new Date().toISOString()

    // Create user
    const putCommand = new PutCommand({
      TableName: TABLE_USERS,
      Item: {
        email,
        userId,
        passwordHash: hashedPassword,
        createdAt: now,
        updatedAt: now,
      },
    })

    await docClient.send(putCommand)

    return NextResponse.json({
      success: true,
      user: { id: userId, email, createdAt: now },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
