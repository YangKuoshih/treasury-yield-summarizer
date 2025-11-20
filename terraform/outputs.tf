output "api_gateway_url" {
  description = "URL of the API Gateway"
  value       = aws_apigatewayv2_api.http_api.api_endpoint
}

output "amplify_app_id" {
  description = "ID of the Amplify App"
  value       = aws_amplify_app.nextjs_app.id
}

output "amplify_default_domain" {
  description = "Default domain of the Amplify App"
  value       = aws_amplify_app.nextjs_app.default_domain
}

output "dynamodb_table_users" {
  description = "Name of the Users DynamoDB table"
  value       = aws_dynamodb_table.users.name
}

output "dynamodb_table_sessions" {
  description = "Name of the Sessions DynamoDB table"
  value       = aws_dynamodb_table.sessions.name
}
