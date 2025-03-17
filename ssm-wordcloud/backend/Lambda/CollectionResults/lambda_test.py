import lambda_function


def testPut():

    event = {
        "httpMethod": "POST",
        "body": "{\"response\": \"Southerners\"}",
        "headers": "{\"origin\": \"http://localhost:3000\"}"
    }

    output = lambda_function.lambda_handler(event, None)

    assert output["statusCode"] == 200
    print("[INFO] Test Put Success", output["body"])
def testGet():
    event = {
        "httpMethod": "GET",
        "headers": "{\"origin\": \"http://localhost:3000\"}"
    }

    output = lambda_function.lambda_handler(event, None)

    assert output["statusCode"] == 200
    print("[INFO] Test Get Success", output["body"])


if __name__ == "__main__":
    testPut()
    testGet()