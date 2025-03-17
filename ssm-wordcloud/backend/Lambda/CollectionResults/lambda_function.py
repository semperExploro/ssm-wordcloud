import S3
import json

OBJECT_NAME = "responses.json"

def cosineSimilarityBetweenTwoWords(word1, word2):
    # Step 1: Convert words to character frequency vectors
    def word_to_vector(word):
        vector = {}
        for char in word:
            vector[char] = vector.get(char, 0) + 1
        return vector

    vec1 = word_to_vector(word1)
    vec2 = word_to_vector(word2)

    # Step 2: Compute the dot product
    dot_product = sum(vec1[char] * vec2.get(char, 0) for char in vec1)

    # Step 3: Compute magnitudes of the vectors
    magnitude1 = sum(val ** 2 for val in vec1.values()) ** 0.5
    magnitude2 = sum(val ** 2 for val in vec2.values()) ** 0.5

    # Step 4: Compute Cosine Similarity (avoid division by zero)
    if magnitude1 == 0 or magnitude2 == 0:
        return 0.0  # If either word has no common characters

    return dot_product / (magnitude1 * magnitude2)


def lambda_handler(event, context):

    s3 = S3.S3_Bucket('jhussm-s3-bucket')

    ###########################
    # Get the body from API Gateway
    ###########################
   
    typeOfRequest = event['httpMethod']
    ###########################
    # Get the contents of the file
    ###########################
    contents = json.loads(s3.getContentsOfFile(OBJECT_NAME))["Responses"]

    if typeOfRequest == "POST":
        body = event['body']

        if isinstance(body, str):
            body = json.loads(body)

        response_name = body['response']
        for entry in contents:
            word = entry[0]
            count = entry[1]

            similarity = cosineSimilarityBetweenTwoWords(response_name, word)
            if similarity > 0.9:
                entry[1] = count + 1
            else:
                contents.append([response_name, 1])

        ###########################
        # Update the file
        ###########################
        s3.uploadFileWithContents(OBJECT_NAME, json.dumps({"Responses": contents}))

        return {
            "statusCode": 200,
            "body": "Success"
        }
    
    elif typeOfRequest == "GET":
        return {
            "statusCode": 200,
            "body": json.dumps(contents)
        }
    
    else:
        return {
            "statusCode": 400,
            "body": "Invalid request"
        }