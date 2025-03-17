
import boto3
import json as JSON

PRESIGNED_DEFAULT = 3600

class S3_Bucket:

    """
    This is a class represntation of a S3 Bucket
    """

    def __init__(self, bucket_name: str) -> None:
        """
        The constructor for a S3 bucket
        :param bucket_name: a string for the bucket_name
        """

        self.bucket_name = bucket_name
        self.s3_client = boto3.client('s3')

    
    def getPresignedURLWrite(self,object_name: str, time_limit = PRESIGNED_DEFAULT) -> None: 
        """
        Function to Get Presigned URLs for Objects for Write 
        :param object_name: a string for the object to fetch for
        :param time_limit: int for the expiration time for that link
        """
        try: 
            generatedURl = self.s3_client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': object_name
                },
                ExpiresIn=time_limit
            )

            return generatedURl
        except Exception as e: 
            print("[INFO] Error in getting presigned url for write", e)
            raise Exception("Error in getting presigned url for write")

    def getPresignedURLRead(self,object_name:str,time_limit = PRESIGNED_DEFAULT) -> None:
        """
        Function to Read URLs for Objects for Read
        :param object_name: string for the object to read
        :param time_limit: integer for the time limit that a url is valid for 
        """
        try:
            generatedPresigned = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': object_name
                },
                ExpiresIn=time_limit
            )
            return generatedPresigned
        except Exception as e: 
            print("[INFO] Error in getting presigned url for read", e)
            raise Exception("Error in getting presigned url for read")

    def deleteObject(self,object_name:str) -> None:
        """
        Function to delete an object 
        :param object_name: string for the object to delete
        """
        try:
            response = self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=object_name
            )
            return response
        except Exception as e: 
            raise Exception("Error in deleting object")

    def copyObjectCrossBucket(self,object_name:str, bucket_dest: str, target_name: str) -> None: 
        """
        Function to copy objects across buckets
        :param object_name: string for the object to copy 
        :param bucket_dest: string for destination of that file in terms of bucket
        :param target_name: string for the new file name at the new bucket
        """
        try: 
            response = self.s3_client.copy_object(
                Bucket=bucket_dest,
                CopySource={
                    'Bucket': self.bucket_name,
                    'Key': object_name
                },
                Key=target_name
            )
            return response
        except Exception as e: 
            raise Exception("Error in copying object across buckets")
    
    def renameObject(self,object_name:str, dest_name: str) -> None: 
        """
        Function to rename an object
        :param object_name: string for the object to rename
        :param dest_name: string for the new file name 
        """
        try: 
            self.copyObjectCrossBucket(object_name,self.bucket_name,dest_name)
            self.deleteObject(object_name)  
        except Exception as e: 
            raise Exception("Error in renaming object " + str(e))
        
    def listObjectsWithPrefix(self,prefix:str) -> list: 
        """
        Function to list objects with a prefix
        :param prefix: string for the prefix to list objects with
        """
        try: 
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix
            )

            if "Contents" not in response:
                return 200, []
    
            responseDict = []
            for obj in response["Contents"]:
                objectDict  = {}

                # Ignore folders
                if obj["Key"][-1] == "/":
                    continue

                keyRecord =  (obj["Key"]).split("/")[2]

                # If the record is a record document, get the date of the record
                objectDict["record_creation_date"] = self.getRecordCreationDate(keyRecord)
                objectDict["name"] = obj["Key"]
                dateTimeStr = obj["LastModified"].strftime("%Y-%m-%d %H:%M:%S")
                objectDict["last_modified"] = dateTimeStr
                responseDict.append(objectDict)

            return 200, (responseDict)   
        except Exception as e: 
            return 400, "Error in listing objects with prefix " + str(e)
        
    def listRecordsOfPatient(self,prefix:str) -> list: 
        """
        Function to list objects with a prefix
        :param prefix: string for the prefix to list objects with
        """
        try: 
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix
            )

            if "Contents" not in response:
                return 200, JSON.dumps([])
    
            responseDict = []
            for obj in response["Contents"]:
                objectDict  = {}

                # Ignore folders
                if obj["Key"][-1] == "/":
                    continue

                objectDict = obj["Key"].split("/")[2]
                if objectDict not in responseDict:
                    responseDict.append(objectDict)

            return 200, (responseDict)
        except Exception as e:
            return 400, "Error in listing objects with prefix " + str(e)
            
    def checkIfFileWasCreatedOnDate(self, date:str) -> bool:
        """
        Function to check if a file was created on a certain date
        :param object_record: string for the object record to check
        :param date: string for the date to check
        """

        IndexName = "assessment_date"
        KeyConditionExpression = "assessment_date = :date"
        ExpressionAttributeValues = {
            ":date": date
        }
        response = self.file_creation_date.query(
            IndexName=IndexName,
            KeyConditionExpression=KeyConditionExpression,
            ExpressionAttributeValues=ExpressionAttributeValues
        )

        if len(response["Items"]) > 0:
            return True
        else:
            return False

    def getRecordCreationDate(self, object_record:str) -> str:
        """
        Function to get the creation date of a record
        :param object_record: string for the object record to get the creation date for
        """

        numSlashes = object_record.count("/")
        assessment = None
        # attempts at getting the assessment date 
        if numSlashes == 3:
            assessment = object_record.split("/")[2]
        elif numSlashes == 2:
            assessment = object_record.split("/")[1]
        else:
            assessment = object_record.split("/")[0]

        try:
            response = self.file_creation_date.get_item(Key={"assessment_uuid": assessment})
            output =  response["Item"]['assessment_date']
            return output
        except Exception as e:
            print("[INFO] Error in getting record creation date , " + str(e))
            return "Your File Is Still Processing, Please Refresh The Page" # if there's an error, highly likely that the file is still processing


    def downloadObject(self,object_name:str,dest_name:str) -> None: 
        """
        Function to download an object
        :param object_name: string for the object to download
        :param dest_name: string for the destination file name
        """
        try: 
            self.s3_client.download_file(self.bucket_name,object_name,dest_name)
        except Exception as e: 
            raise Exception("Error in downloading object")
        
    def checKIfObjectExists(self,object_name:str) -> bool: 
        """
        Function to check if an object exists
        :param object_name: string for the object to check if it exists
        """
        try: 
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=object_name
            )
            return len(response["Contents"]) > 0
        except Exception as e: 
            raise Exception("Error in checking if object exists")
        
    def getContentsOfFile(self,object_name:str) -> str: 
        """
        Function to get the contents of a file
        :param object_name: string for the object to get the contents of
        """
        try: 
            response = self.s3_client.get_object(
                Bucket=self.bucket_name,
                Key=object_name
            )
            return response["Body"].read()
        except Exception as e: 
            print("[INFO] Error in getting contents of file", e)
            raise Exception("Error in getting contents of file")
        
    def deleteWithPrefix(self, searchPrefix):
        code, objects = self.listObjectsWithPrefix(searchPrefix)
        if code == 200:
            for obj in objects:
                self.s3_client.delete_object(Bucket=self.bucket_name, Key=obj['name'])

    def uploadFileWithContents(self, fileName, contents):
        self.s3_client.put_object(Body=contents, Bucket=self.bucket_name, Key=fileName)

#################################################################################
#                               Testing                                         #
#################################################################################
        
if __name__ == "__main__":
    pass