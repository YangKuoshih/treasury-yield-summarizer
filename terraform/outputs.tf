output "api_gateway_url" {
  description = "The URL of the API Gateway"
  value       = aws_apigatewayv2_api.http_api.api_endpoint
}

output "dynamodb_table_users" {
  description = "The name of the DynamoDB table for users"
  value       = aws_dynamodb_table.users.name
}

output "dynamodb_table_sessions" {
  description = "The name of the DynamoDB table for sessions"
  value       = aws_dynamodb_table.sessions.name
}

output "cloudfront_url" {
  description = "The URL of the CloudFront distribution"
  value       = "https://${aws_cloudfront_distribution.s3_distribution.domain_name}"
}

output "s3_bucket_name" {
  description = "The name of the S3 bucket hosting the website"
  value       = aws_s3_bucket.website_bucket.id
}
