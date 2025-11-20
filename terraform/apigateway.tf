resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

# Integration for AI Summarizer
resource "aws_apigatewayv2_integration" "ai_summarizer" {
  api_id           = aws_apigatewayv2_api.http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.ai_summarizer.invoke_arn
}

resource "aws_apigatewayv2_route" "ai_summarizer" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /summarize"
  target    = "integrations/${aws_apigatewayv2_integration.ai_summarizer.id}"
}

resource "aws_lambda_permission" "api_gw_ai" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ai_summarizer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*/summarize"
}

# Integration for Yield Fetcher (Optional: Manual Trigger)
resource "aws_apigatewayv2_integration" "yield_fetcher" {
  api_id           = aws_apigatewayv2_api.http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.yield_fetcher.invoke_arn
}

resource "aws_apigatewayv2_route" "yield_fetcher" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /fetch-yields"
  target    = "integrations/${aws_apigatewayv2_integration.yield_fetcher.id}"
}

resource "aws_lambda_permission" "api_gw_yield" {
  statement_id  = "AllowExecutionFromAPIGatewayYield"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.yield_fetcher.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*/fetch-yields"
}
