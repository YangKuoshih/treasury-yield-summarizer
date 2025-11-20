resource "aws_amplify_app" "nextjs_app" {
  name       = var.project_name
  repository = var.github_repo

  # The following build_spec is a default for Next.js. 
  # Amplify Hosting often auto-detects this, but explicit config is safer.
  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
  EOT

  environment_variables = {
    NEXT_PUBLIC_API_URL = aws_apigatewayv2_api.http_api.api_endpoint
    DYNAMODB_TABLE_USERS = aws_dynamodb_table.users.name
    DYNAMODB_TABLE_SESSIONS = aws_dynamodb_table.sessions.name
    # Add other env vars as needed
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.nextjs_app.id
  branch_name = "main"

  framework = "Next.js - SSR"
  stage     = "PRODUCTION"
}
