import json
import os
import boto3
import logging
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_ddb_table():
    ENV = os.environ['ENVIRONMENT']
    if ENV == 'local':
        return boto3.resource('dynamodb', endpoint_url='http://dynamodb:8000/').Table("dota-clarity-matches-table")
    else:
        return boto3.resource('dynamodb').Table(os.environ["TABLE_NAME"])

def generateResponse(statusCode, body):
    return {
        "statusCode": statusCode,
        "body": body,
        "headers": {
            "X-Requested-With": '*',
            "Access-Control-Allow-Origin": '*',
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        "isBase64Encoded": False
    }

def lambda_handler(event, context):
    id = event['pathParameters']["id"]
    match_id = event['pathParameters']["match_id"]
    key = {'id': id, 'match_id': int(match_id)}
    try:
        logger.info("Deleting match for id {} and match_id {} from table {}".format(id, match_id, os.environ["TABLE_NAME"]))
        ddb = get_ddb_table()
        ddb.delete_item(Key=key)
    except ClientError as e:
        return generateResponse(400, { "Error" : "Unable to get match from DynamoDb: %s" % e.response['Error']['Message']})
    else:
        logger.info("Deleted match item for id {} and match_id {}".format(id, match_id))
        return generateResponse(202, None)