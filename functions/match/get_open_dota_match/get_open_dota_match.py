import json
import os
import boto3
import logging
import decimal
import requests
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError
from odtranslator import Translator

logger = logging.getLogger()
logger.setLevel(logging.INFO)

translate = Translator()

# Helper class to convert a DynamoDB item to JSON.


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)


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


def get_open_dota_match(match_id):
    headers = {"Content-Type": "application/json"}
    opendota_url = "https://api.opendota.com/api/matches/" + match_id
    od_response = requests.get(opendota_url, headers=headers)
    if od_response.status_code != 200:
        message = "No match account is affiliated with the provided match ID"
        logger.error(message)
        return generate_response(404, message)
    return json.loads(od_response.text)


# def lambda_handler(event, context):

def test(match_id):
    # match_id = int(event['pathParameters']['match_id'])
    od_match = get_open_dota_match(match_id)
    match_keys = ("dire_score", "duration", "first_blood_time", "game_mode", "lobby_type", "radiant_gold_adv", "radiant_score",
                  "radiant_win", "radiant_xp_adv", "start_time", "teamfights", "version", "skill", "players", "patch", "region", "replay_url")
    # match = {k: od_match[k] for k in match_keys if k in od_match}
    player_data = translate.get_player_data(od_match["players"])
    print(json.dumps(player_data))

test('5392211187')