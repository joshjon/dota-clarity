import json
import os
import boto3
import logging
import decimal
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Helper class to convert a DynamoDB item to JSON.
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)

def get_ddb_table():
    ENV = os.environ['ENVIRONMENT']
    if ENV == 'local':
        return boto3.resource('dynamodb', endpoint_url='http://dynamodb:8000/').Table("dota-clarity-matches-table")
    else:
        return boto3.resource('dynamodb').Table(os.environ["TABLE_NAME"])

def generate_response(statusCode, body):
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
    id_key = event['pathParameters']['id']
    try:
        logger.info("Getting matches from table " + os.environ["TABLE_NAME"] + " for id " + id_key)
        ddb = get_ddb_table()
        ddb_response = ddb.query(KeyConditionExpression=Key('id').eq(id_key))
    except ClientError as e:
        return generate_response(400, "Unable to get matches from DynamoDb: %s" % e.response['Error']['Message'])
    else:
        logger.info("DynamoDB response: " + json.dumps(ddb_response, indent=4, cls=DecimalEncoder))
        items = ddb_response["Items"]
        return generate_response(200, json.dumps(items, indent=4, cls=DecimalEncoder))
