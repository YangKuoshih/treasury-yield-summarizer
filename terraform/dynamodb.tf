resource "aws_dynamodb_table" "users" {
  name           = "${var.project_name}-users"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "email"

  attribute {
    name = "email"
    type = "S"
  }

  tags = {
    Project = var.project_name
  }
}

resource "aws_dynamodb_table" "sessions" {
  name           = "${var.project_name}-sessions"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "sessionToken"

  attribute {
    name = "sessionToken"
    type = "S"
  }

  ttl {
    attribute_name = "expires"
    enabled        = true
  }

  tags = {
    Project = var.project_name
  }
}

resource "aws_dynamodb_table" "yield_data" {
  name           = "${var.project_name}-data"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "date"
  range_key      = "type" # e.g., "yield_curve" or "historical"

  attribute {
    name = "date"
    type = "S"
  }

  attribute {
    name = "type"
    type = "S"
  }

  tags = {
    Project = var.project_name
  }
}
