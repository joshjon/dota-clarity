import json
import os
import boto3
import logging
import decimal
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError

# Helper class to convert a DynamoDB item to JSON.


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)


logger = logging.getLogger()
logger.setLevel(logging.INFO)


def get_ddb():
    ENV = os.environ['ENVIRONMENT']
    if ENV == 'local':
        return boto3.resource('dynamodb', endpoint_url='http://dynamodb:8000/')
    else:
        return boto3.resource('dynamodb')


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
    id_key = {'id': event['pathParameters']['id']}
    try:
        logger.info("Getting profile from table %s" % os.environ["TABLE_NAME"])
        ddb = get_ddb()
        table = ddb.Table(os.environ["TABLE_NAME"])
        ddb_response = table.get_item(Key=id_key)
    except ClientError as e:
        return generateResponse(400, "Unable to add profile to DynamoDb: %s" % e.response['Error']['Message'])
    else:
        item = ddb_response['Item']
        return generateResponse(201, "Get profile succeeded: %s" % json.dumps(item, indent=4, cls=DecimalEncoder))