import { docClient, TABLE_NAME } from "./dynamodb"
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import bcrypt from "bcryptjs"
import type { User } from "./types"

export async function getUserByEmail(email: string): Promise<User | null> {
  // Note: In a production app, you'd want a GSI on email.
  // For this demo, we'll scan or assume userId is derived/lookup table.
  // To keep it simple and efficient without GSI for now, we will scan (not recommended for large scale)
  // OR we can just use email as the partition key for simplicity in this specific demo.
  // Let's use email as the partition key for the Users table to make lookups fast.

  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        userId: email, // Using email as the primary key for simplicity
      },
    })

    const response = await docClient.send(command)
    return response.Item as User | null
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function createUser(email: string, password: string): Promise<User | null> {
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return null // User already exists
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const userId = email // Using email as ID for simplicity
  const now = Date.now()

  const user: User = {
    userId,
    email,
    createdAt: now,
    lastLogin: now,
  }

  // We store the password hash but don't return it in the User type
  const itemToSave = {
    ...user,
    passwordHash,
  }

  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: itemToSave,
    })

    await docClient.send(command)
    return user
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function verifyUser(email: string, password: string): Promise<User | null> {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        userId: email,
      },
    })

    const response = await docClient.send(command)
    const item = response.Item

    if (!item) {
      return null
    }

    const isValid = await bcrypt.compare(password, item.passwordHash)
    if (!isValid) {
      return null
    }

    // Return user without password hash
    const { passwordHash, ...user } = item
    return user as User
  } catch (error) {
    console.error("Error verifying user:", error)
    return null
  }
}
