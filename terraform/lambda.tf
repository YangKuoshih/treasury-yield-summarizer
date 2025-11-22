resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_role.name
}

resource "aws_iam_policy" "lambda_policy" {
  name        = "${var.project_name}-lambda-policy"
  description = "Policy for accessing DynamoDB and Bedrock"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.users.arn,
          aws_dynamodb_table.sessions.arn,
          aws_dynamodb_table.yield_data.arn,
          aws_dynamodb_table.news.arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel"
        ]
        Resource = [
          "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-sonnet-4-5-20250929-v1:0",
          "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_custom_policy" {
  policy_arn = aws_iam_policy.lambda_policy.arn
  role       = aws_iam_role.lambda_role.name
}

data "archive_file" "yield_fetcher_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/yield-fetcher"
  output_path = "${path.module}/yield-fetcher.zip"
}

resource "aws_lambda_function" "yield_fetcher" {
  filename         = data.archive_file.yield_fetcher_zip.output_path
  function_name    = "${var.project_name}-yield-fetcher"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.yield_fetcher_zip.output_base64sha256
  runtime          = "nodejs20.x"
  timeout          = 60

  environment {
    variables = {
      FRED_API_KEY = var.fred_api_key
      TABLE_NAME   = aws_dynamodb_table.yield_data.name
    }
  }
}

data "archive_file" "ai_summarizer_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/ai-summarizer"
  output_path = "${path.module}/ai-summarizer.zip"
}

resource "aws_lambda_function" "ai_summarizer" {
  filename         = data.archive_file.ai_summarizer_zip.output_path
  function_name    = "${var.project_name}-ai-summarizer"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.ai_summarizer_zip.output_base64sha256
  runtime          = "nodejs20.x"
  timeout          = 60

  environment {
    variables = {
      MODEL_ID        = "anthropic.claude-4-5-sonnet-20250220-v1:0"
      NEWS_TABLE_NAME = aws_dynamodb_table.news.name
    }
  }
}

# EventBridge Schedule for Yield Fetcher (Daily at 6 PM EST)
resource "aws_cloudwatch_event_rule" "daily_fetch" {
  name                = "${var.project_name}-daily-fetch"
  description         = "Fires daily at 6 PM EST"
  schedule_expression = "cron(0 23 * * ? *)" # 6 PM EST is 23:00 UTC (standard time)
}

resource "aws_cloudwatch_event_target" "fetch_target" {
  rule      = aws_cloudwatch_event_rule.daily_fetch.name
  target_id = "lambda"
  arn       = aws_lambda_function.yield_fetcher.arn
}

resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.yield_fetcher.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_fetch.arn
}

data "archive_file" "news_fetcher_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/news-fetcher"
  output_path = "${path.module}/news-fetcher.zip"
}

resource "aws_lambda_function" "news_fetcher" {
  filename         = data.archive_file.news_fetcher_zip.output_path
  function_name    = "${var.project_name}-news-fetcher"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.news_fetcher_zip.output_base64sha256
  runtime          = "nodejs20.x"
  timeout          = 60

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.news.name
    }
  }
}

# EventBridge Schedule for News Fetcher (Daily at 6:05 PM EST)
resource "aws_cloudwatch_event_rule" "daily_news_fetch" {
  name                = "${var.project_name}-daily-news-fetch"
  description         = "Fires daily at 6:05 PM EST"
  schedule_expression = "cron(5 23 * * ? *)"
}

resource "aws_cloudwatch_event_target" "news_fetch_target" {
  rule      = aws_cloudwatch_event_rule.daily_news_fetch.name
  target_id = "lambda"
  arn       = aws_lambda_function.news_fetcher.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_news" {
  statement_id  = "AllowExecutionFromCloudWatchNews"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.news_fetcher.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_news_fetch.arn
}

data "archive_file" "yield_summary_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda/yield-summary"
  output_path = "${path.module}/yield-summary.zip"
}

resource "aws_lambda_function" "yield_summary" {
  filename         = data.archive_file.yield_summary_zip.output_path
  function_name    = "${var.project_name}-yield-summary"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.yield_summary_zip.output_base64sha256
  runtime          = "nodejs20.x"
  timeout          = 60

  environment {
    variables = {
      MODEL_ID = "anthropic.claude-sonnet-4-5-20250929-v1:0"
    }
  }
}
