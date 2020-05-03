import json
import os
import boto3
import requests
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


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

def getOpenDotaProfile(steamid):
    headers = {"Content-Type": "application/json"}
    opendota_url = "https://api.opendota.com/api/players/" + steamid
    return requests.get(opendota_url, headers=headers) 


def lambda_handler(event, context):
    if "body" not in event:
        message = "A body as not been provided in the request"
        logger.error(message)
        return generateResponse(400, message)

    logger.info("Begin create profile")
    profile_data = json.loads(event["body"])

    # Ensure event body contains all required keys
    expected_keys = ["id", "steamid", "roles", "age"]
    for key in expected_keys:
        if key not in profile_data:
            message = "Missing required key: " + key
            logger.error(message)
            return generateResponse(400, message)

    # Get profile from OpenDota API
    od_response = getOpenDotaProfile(profile_data["steamid"])

    if od_response.status_code != 200:
        message = "No Dota account is affiliated with the provided Steam ID"
        logger.error(message)
        return generateResponse(404, message)

    od_data = json.loads(od_response.text)

    profile_data["rank_tier"] = od_data["rank_tier"]
    profile_data["mmr"] = od_data["mmr_estimate"]["estimate"]
    profile_data["steam_url"] = od_data["profile"]["profileurl"]
    profile_data["avatar"] = od_data["profile"]["avatarfull"]
    profile_data["country_code"] = od_data["profile"]["loccountrycode"]

    # Add profile to DynamoDB
    try:
        logger.info("Adding profile to table %s" % os.environ["TABLE_NAME"])
        ddb = boto3.resource("dynamodb")
        table = ddb.Table(os.environ["TABLE_NAME"])
        ddb_response = table.put_item(Item=profile_data)
        logger.info("DynamoDB response: %s" % json.dumps(ddb_response))
    except Exception as e:
        return generateResponse(400, "Unable to add profile to DynamoDb: %s" % e)

    lambda_response = generateResponse(201, "Profile was successfuly saved to table %s" % os.environ["TABLE_NAME"])
    return lambda_response
