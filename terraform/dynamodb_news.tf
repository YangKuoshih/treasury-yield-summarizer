resource "aws_dynamodb_table" "news" {
  name           = "${var.project_name}-news"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "date"
  range_key      = "type"

  attribute {
    name = "date"
    type = "S"
  }

  attribute {
    name = "type"
    type = "S"
  }

  tags = {
    Environment = "dev"
    Project     = var.project_name
  }
}
