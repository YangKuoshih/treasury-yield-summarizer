variable "aws_region" {
  description = "AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "treasury-yield-summarizer"
}

variable "fred_api_key" {
  description = "API Key for FRED (Federal Reserve Economic Data)"
  type        = string
  sensitive   = true
}

variable "github_repo" {
  description = "GitHub repository URL for Amplify (e.g., https://github.com/username/repo)"
  type        = string
  default     = "" # User to provide if connecting Amplify
}
