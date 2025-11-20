# Treasury Yield Summarizer - Design Document

## Executive Summary

The Treasury Yield Summarizer is a full-stack web application that fetches real-time U.S. Treasury yield data from the FRED API, visualizes yield curves, and generates AI-powered summaries using AWS Bedrock. The system supports both real-time updates and daily batch processing, with user authentication stored in DynamoDB.

---

## 1. System Architecture

### 1.1 High-Level Architecture

\`\`\`
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────────┐
│  FRED API       │  │  AWS Services    │
│  (Treasury Data)│  │  - DynamoDB      │
└─────────────────┘  │  - Bedrock       │
                     │  - Lambda        │
                     └──────────────────┘
\`\`\`

### 1.2 Component Architecture

**Frontend (Next.js 16 + TypeScript)**
- Server Components for data fetching
- Client Components for interactive charts
- Server Actions for authentication and data mutations
- Route Handlers for API endpoints

**Backend Services**
- AWS Lambda for scheduled batch processing
- AWS Bedrock (Claude) for AI summarization
- DynamoDB for user authentication and session management
- FRED API for Treasury yield data

---

## 2. Data Flow

### 2.1 Real-Time Data Flow

1. User requests dashboard → Next.js Server Component
2. Server fetches fresh data from FRED API
3. Data transformed and passed to client components
4. Charts render with Recharts
5. AI summary generated via AWS Bedrock API call

### 2.2 Batch Processing Flow

1. AWS EventBridge triggers Lambda (daily at 6 PM EST)
2. Lambda fetches Treasury yield data from FRED
3. Lambda invokes Bedrock for AI summary
4. Results cached in DynamoDB (optional)
5. Next.js app reads cached data when available

---

## 3. API Integration Specifications

### 3.1 FRED API Integration

**Base URL:** `https://api.stlouisfed.org/fred`

**Required Series IDs:**
- `DGS1MO` - 1-Month Treasury
- `DGS3MO` - 3-Month Treasury
- `DGS6MO` - 6-Month Treasury
- `DGS1` - 1-Year Treasury
- `DGS2` - 2-Year Treasury
- `DGS5` - 5-Year Treasury
- `DGS10` - 10-Year Treasury
- `DGS30` - 30-Year Treasury

**Key Endpoints:**
\`\`\`
GET /series/observations?series_id={SERIES_ID}&api_key={API_KEY}&file_type=json
\`\`\`

**Response Format:**
\`\`\`json
{
  "observations": [
    {
      "date": "2025-01-15",
      "value": "4.25"
    }
  ]
}
\`\`\`

### 3.2 AWS Bedrock Integration

**Model:** `anthropic.claude-3-5-sonnet-20241022-v2:0`

**API Call Pattern:**
\`\`\`typescript
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

const payload = {
  anthropic_version: "bedrock-2023-05-31",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: `Analyze this Treasury yield data: ${JSON.stringify(yieldData)}`
    }
  ]
};

const command = new InvokeModelCommand({
  modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
  body: JSON.stringify(payload)
});
\`\`\`

### 3.3 DynamoDB Schema

**Users Table:**
\`\`\`
Table Name: treasury-yield-users
Partition Key: userId (String)

Attributes:
- userId: String (UUID)
- email: String
- passwordHash: String (bcrypt)
- createdAt: Number (timestamp)
- lastLogin: Number (timestamp)
\`\`\`

**Sessions Table (Optional):**
\`\`\`
Table Name: treasury-yield-sessions
Partition Key: sessionId (String)
TTL: expiresAt (Number)

Attributes:
- sessionId: String (UUID)
- userId: String
- expiresAt: Number (timestamp)
\`\`\`

---

## 4. Frontend Implementation

### 4.1 Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **UI Components:** shadcn/ui
- **State Management:** React hooks + SWR for client-side caching

### 4.2 Key Pages

1. **Login Page** (`/login`)
   - Email/password authentication
   - Form validation
   - Error handling

2. **Dashboard** (`/dashboard`)
   - Yield curve chart (line chart)
   - Historical comparison chart
   - AI summary panel
   - Real-time data refresh button

3. **Settings** (`/settings`)
   - User preferences
   - Notification settings

### 4.3 Component Structure

\`\`\`
components/
├── auth/
│   ├── login-form.tsx
│   └── auth-provider.tsx
├── dashboard/
│   ├── yield-curve-chart.tsx
│   ├── historical-chart.tsx
│   └── ai-summary-panel.tsx
├── layout/
│   ├── header.tsx
│   └── sidebar.tsx
└── ui/
    └── (shadcn components)
\`\`\`

---

## 5. Backend Implementation

### 5.1 Next.js API Routes

**Authentication Routes:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

**Data Routes:**
- `GET /api/treasury/yields` - Fetch current yields
- `GET /api/treasury/historical` - Fetch historical data
- `POST /api/ai/summarize` - Generate AI summary

### 5.2 AWS Lambda Functions

**Function 1: Daily Yield Fetcher**
\`\`\`
Name: treasury-yield-fetcher
Runtime: Node.js 20.x
Trigger: EventBridge (cron: 0 18 * * ? *)
Environment Variables:
  - FRED_API_KEY
  - DYNAMODB_TABLE_NAME
\`\`\`

**Function 2: AI Summarizer**
\`\`\`
Name: treasury-yield-summarizer
Runtime: Node.js 20.x
Trigger: Invoked by yield-fetcher
Environment Variables:
  - BEDROCK_MODEL_ID
  - AWS_REGION
\`\`\`

### 5.3 IAM Permissions

**Lambda Execution Role:**
\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:*:table/treasury-yield-*"
    }
  ]
}
\`\`\`

---

## 6. Security Considerations

### 6.1 Authentication
- Passwords hashed with bcrypt (10 rounds)
- Session tokens stored in HTTP-only cookies
- CSRF protection via Next.js built-in mechanisms

### 6.2 API Security
- FRED API key stored in environment variables
- AWS credentials via IAM roles (no hardcoded keys)
- Rate limiting on API routes (10 requests/minute per user)

### 6.3 Data Protection
- HTTPS only in production
- DynamoDB encryption at rest enabled
- Sensitive data never logged

---

## 7. Deployment Guide

### 7.1 AWS Infrastructure Setup

**Step 1: Create DynamoDB Tables**
\`\`\`bash
aws dynamodb create-table \
  --table-name treasury-yield-users \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
\`\`\`

**Step 2: Deploy Lambda Functions**
\`\`\`bash
# Package Lambda
cd lambda/yield-fetcher
npm install
zip -r function.zip .

# Deploy
aws lambda create-function \
  --function-name treasury-yield-fetcher \
  --runtime nodejs20.x \
  --handler index.handler \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::ACCOUNT_ID:role/lambda-execution-role
\`\`\`

**Step 3: Create EventBridge Rule**
\`\`\`bash
aws events put-rule \
  --name daily-yield-fetch \
  --schedule-expression "cron(0 18 * * ? *)"

aws events put-targets \
  --rule daily-yield-fetch \
  --targets "Id"="1","Arn"="arn:aws:lambda:us-east-1:ACCOUNT_ID:function:treasury-yield-fetcher"
\`\`\`

### 7.2 Next.js Deployment (AWS Amplify or EC2)

**Option A: AWS Amplify**
1. Connect GitHub repository
2. Configure build settings:
   \`\`\`yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   \`\`\`
3. Add environment variables in Amplify console

**Option B: EC2 with PM2**
\`\`\`bash
# Install dependencies
npm install
npm run build

# Start with PM2
pm2 start npm --name "treasury-app" -- start
pm2 save
pm2 startup
\`\`\`

### 7.3 Environment Variables

**Next.js App:**
\`\`\`env
FRED_API_KEY=your_fred_api_key
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
DYNAMODB_TABLE_NAME=treasury-yield-users
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
NEXTAUTH_SECRET=your_nextauth_secret
\`\`\`

---

## 8. Monitoring & Logging

### 8.1 CloudWatch Metrics
- Lambda invocation count
- Lambda error rate
- API Gateway latency
- DynamoDB read/write capacity

### 8.2 Application Logging
- Next.js logs via CloudWatch Logs
- Lambda logs via CloudWatch Logs
- Error tracking with console.error

### 8.3 Alerts
- Lambda failure → SNS notification
- API error rate > 5% → SNS notification
- DynamoDB throttling → SNS notification

---

## 9. Cost Estimation

**Monthly Costs (Estimated):**
- DynamoDB: $5-10 (100 users, light usage)
- Lambda: $1-5 (1 daily invocation)
- Bedrock: $10-20 (30 AI summaries/month)
- EC2/Amplify: $20-50 (t3.small instance or Amplify hosting)
- **Total: $36-85/month**

---

## 10. Future Enhancements

1. **Real-time WebSocket Updates** - Push yield changes to clients
2. **Historical Data Caching** - Store FRED data in DynamoDB to reduce API calls
3. **Multi-user Dashboards** - Customizable widgets and layouts
4. **Email Notifications** - Daily yield summaries via SES
5. **Mobile App** - React Native companion app
6. **Advanced Analytics** - Yield spread analysis, inversion detection

---

## 11. Testing Strategy

### 11.1 Unit Tests
- Jest for utility functions
- React Testing Library for components

### 11.2 Integration Tests
- Test FRED API integration
- Test Bedrock API integration
- Test DynamoDB operations

### 11.3 E2E Tests
- Playwright for critical user flows
- Login → Dashboard → Data refresh

---

## 12. References

- [FRED API Documentation](https://fred.stlouisfed.org/docs/api/fred/)
- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Author:** Treasury Yield Summarizer Team
\`\`\`
