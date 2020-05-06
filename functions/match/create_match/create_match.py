import json
import os
import boto3
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

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

def get_hero_name(hero_id):
    f = open('heroes.json')
    hero_data = json.load(f)
    for hero in hero_data: 
        if hero["id"] == hero_id:
            name = hero["name"].replace("npc_dota_hero_", "")
            name = name.replace("_", " ")
            return name.title()
    return "Unknown"

def lambda_handler(event, context):
    id_key = event['pathParameters']['id']
    if "body" not in event:
        message = "A body as not been provided in the request"
        logger.error(message)
        return generate_response(400, message)

    logger.info("Begin create match")
    data = json.loads(event["body"])
    match_data = {}
    match_data["id"] = id_key
    match_data["hero_name"] = get_hero_name(data["hero_id"])
    match_data

    # Ensure event body contains match_id
    if "match_id" not in match_data:
        message = "Missing required key: match_id"
        logger.error(message)
        return generate_response(400, message)

    # Add match to DynamoDB
    try:
        logger.info("Adding match to table " + os.environ["TABLE_NAME"])
        ddb = get_ddb_table()
        ddb_response = ddb.put_item(Item=match_data)
        logger.info("DynamoDB response: " + json.dumps(ddb_response))
    except ClientError as e:
        return generate_response(400, "Unable to add match to DynamoDb: " + e.response['Error']['Message'])

    return generate_response(201, "Create match succeded")