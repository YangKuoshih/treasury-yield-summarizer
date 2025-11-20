import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
})

export const docClient = DynamoDBDocumentClient.from(client)

export const TABLE_USERS = process.env.DYNAMODB_TABLE_USERS || "treasury-yield-summarizer-users"
export const TABLE_SESSIONS = process.env.DYNAMODB_TABLE_SESSIONS || "treasury-yield-summarizer-sessions"
