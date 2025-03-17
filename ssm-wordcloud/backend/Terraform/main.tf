provider "aws" {
  region = "us-east-1"
}

#########################################
# S3 Bucket
#########################################

resource "aws_s3_bucket" "survey_bucket" {
  bucket = "jhussm-s3-bucket"
}

resource "aws_s3_bucket_policy" "survey_bucket_policy" {
  bucket = aws_s3_bucket.survey_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = {
          AWS = aws_iam_role.lambda_role.arn
        }
        Action    = "s3:GetObject"
        Resource = [
          "${aws_s3_bucket.survey_bucket.arn}/*",
        ]
      },
    ]
  })
}

resource "aws_s3_bucket_cors_configuration" "survey_bucket_cors" {
  bucket = aws_s3_bucket.survey_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}


#########################################
# IAM Role for Lambda Execution
#########################################

resource "aws_iam_role" "lambda_role" {
  name = "lambda_s3_api_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_s3_policy" {
  name        = "LambdaS3AccessPolicy"
  description = "IAM policy for Lambda to access S3"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ],
        Effect = "Allow",
        Resource = [
          aws_s3_bucket.survey_bucket.arn,
          "${aws_s3_bucket.survey_bucket.arn}/*",
        ]
      },
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect   = "Allow",
        Resource = "arn:aws:logs:${var.region}:${var.account_id}:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_s3_policy.arn
}

#########################################
# Lambda Function
#########################################

resource "aws_lambda_function" "survey_lambda" {
  function_name    = "surveyLambda"
  role             = aws_iam_role.lambda_role.arn
  handler          = "lambda_function.lambda_handler"
  runtime          = "python3.8"
  filename         = "lambda_function.zip"
  source_code_hash = filebase64sha256("lambda_function.zip")

}

#########################################
# API Gateway
#########################################

resource "aws_api_gateway_rest_api" "survey_api" {
  name        = "SurveyAPI"
  description = "API Gateway for Survey"
}

# Create /survey resource
resource "aws_api_gateway_resource" "survey_resource" {
  rest_api_id = aws_api_gateway_rest_api.survey_api.id
  parent_id   = aws_api_gateway_rest_api.survey_api.root_resource_id
  path_part   = "survey"
}

# Enable CORS (OPTIONS method)
resource "aws_api_gateway_method" "options_method" {
  rest_api_id   = aws_api_gateway_rest_api.survey_api.id
  resource_id   = aws_api_gateway_resource.survey_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_integration" {
  rest_api_id = aws_api_gateway_rest_api.survey_api.id
  resource_id = aws_api_gateway_resource.survey_resource.id
  http_method = aws_api_gateway_method.options_method.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = <<EOF
{
  "statusCode": 200
}
EOF
  }
}

resource "aws_api_gateway_method_response" "options_response" {
  rest_api_id = aws_api_gateway_rest_api.survey_api.id
  resource_id = aws_api_gateway_resource.survey_resource.id
  http_method = aws_api_gateway_method.options_method.http_method
  status_code = "200"


  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Headers" = true
  }
}

resource "aws_api_gateway_integration_response" "options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.survey_api.id
  resource_id = aws_api_gateway_resource.survey_resource.id
  http_method = aws_api_gateway_method.options_method.http_method
  status_code = aws_api_gateway_method_response.options_response.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin"  = "'*'",
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'",
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type'"
  }
}

# Create GET and POST Methods
resource "aws_api_gateway_method" "get_method" {
  rest_api_id   = aws_api_gateway_rest_api.survey_api.id
  resource_id   = aws_api_gateway_resource.survey_resource.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "post_method" {
  rest_api_id   = aws_api_gateway_rest_api.survey_api.id
  resource_id   = aws_api_gateway_resource.survey_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

# Lambda Integration for GET and POST
resource "aws_api_gateway_integration" "get_integration" {
  rest_api_id             = aws_api_gateway_rest_api.survey_api.id
  resource_id             = aws_api_gateway_resource.survey_resource.id
  http_method             = aws_api_gateway_method.get_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.survey_lambda.invoke_arn
}

resource "aws_api_gateway_integration" "post_integration" {
  rest_api_id             = aws_api_gateway_rest_api.survey_api.id
  resource_id             = aws_api_gateway_resource.survey_resource.id
  http_method             = aws_api_gateway_method.post_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.survey_lambda.invoke_arn
}

# Deploy API
resource "aws_api_gateway_deployment" "survey_deployment" {
  rest_api_id = aws_api_gateway_rest_api.survey_api.id
  stage_name  = "prod"
  depends_on = [
    aws_api_gateway_integration.get_integration,
    aws_api_gateway_integration.post_integration
  ]
}

# Allow API Gateway to Invoke Lambda
resource "aws_lambda_permission" "apigw_lambda" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.survey_lambda.function_name
  principal     = "apigateway.amazonaws.com"
}

#########################################
# AWS WAF Protection
#########################################

resource "aws_wafv2_web_acl" "waf_acl" {
  name        = "SurveyAPIWAF"
  description = "WAF for API Gateway"
  scope       = "REGIONAL"

  default_action {
    allow {}
  }

  rule {
    name     = "BlockBadBots"
    priority = 1

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = 1000
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "BlockBadBots"
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    sampled_requests_enabled   = true
    metric_name                = "SurveyAPIWAF"
  }
}
