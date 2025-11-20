# Deployment Guide: Treasury Yield Summarizer

This guide covers the steps to deploy the Treasury Yield Summarizer application to AWS using Vercel (for frontend/API) or AWS Amplify, along with the necessary backend infrastructure.

## Prerequisites

- AWS Account with administrative access
- Node.js 20.x or later
- FRED API Key (Get one at https://fred.stlouisfed.org/api/api_key.html)

## 1. AWS Infrastructure Setup

### 1.1 DynamoDB Table

Create a DynamoDB table for user authentication:

\`\`\`bash
aws dynamodb create-table \
    --table-name treasury-yield-users \
    --attribute-definitions AttributeName=userId,AttributeType=S \
    --key-schema AttributeName=userId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
\`\`\`

### 1.2 IAM User for Application

Create an IAM user with permissions to access DynamoDB and Bedrock:

1. Go to IAM Console > Users > Create User
2. Name: `treasury-app-user`
3. Attach policies directly:
   - `AmazonDynamoDBFullAccess` (Restrict to specific table in production)
   - `AmazonBedrockFullAccess` (Restrict to specific model in production)
4. Create Access Keys for this user and save the `Access Key ID` and `Secret Access Key`.

### 1.3 Enable Bedrock Model

1. Go to AWS Bedrock Console > Model access
2. Click "Manage model access"
3. Enable `Anthropic Claude 3.5 Sonnet`
4. Save changes

## 2. Application Deployment

### Option A: Vercel (Recommended)

1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. Configure the following Environment Variables:

| Variable | Description |
|----------|-------------|
| `FRED_API_KEY` | Your FRED API Key |
| `AWS_REGION` | `us-east-1` (or your preferred region) |
| `AWS_ACCESS_KEY_ID` | Access Key ID from Step 1.2 |
| `AWS_SECRET_ACCESS_KEY` | Secret Access Key from Step 1.2 |
| `DYNAMODB_TABLE_NAME` | `treasury-yield-users` |
| `BEDROCK_MODEL_ID` | `anthropic.claude-3-5-sonnet-20241022-v2:0` |

4. Deploy!

### Option B: AWS Amplify

1. Go to AWS Amplify Console > New App > Host web app.
2. Connect your GitHub repository.
3. In the Build settings, add the environment variables listed above.
4. Ensure the build image uses Node.js 20.x (Edit `amplify.yml` if needed).
5. Deploy!

## 3. Local Development

1. Clone the repository.
2. Create a `.env.local` file with the environment variables.
3. Run `npm install`.
4. Run `npm run dev`.

## 4. Troubleshooting

- **Bedrock Access Denied**: Ensure you have enabled the specific model in the AWS Bedrock console (Step 1.3).
- **DynamoDB Errors**: Check that the region in your `.env` matches the region where you created the table.
- **FRED API Errors**: Verify your API key is valid and has not exceeded rate limits.

## 5. Security Notes

- In production, restrict the IAM user permissions to only the specific resources needed (Least Privilege Principle).
- Use AWS Secrets Manager for rotating credentials if deploying to EC2/ECS.
- Enable DynamoDB Point-in-Time Recovery (PITR) for backups.
