import json
import logging
import requests
from odtranslator import Translator

logger = logging.getLogger()
logger.setLevel(logging.INFO)
translate = Translator()

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

def lambda_handler(event, context):
    match_id = event['pathParameters']['match_id']
    od_match = get_open_dota_match(match_id)
    match_keys = ("dire_score", "duration", "game_mode", "radiant_score",
                  "radiant_win", "start_time", "skill", "region", "replay_url")
    match = {k: od_match[k] for k in match_keys if k in od_match}
    match["match_id"] = int(match_id)
    match["lobby_type"] = translate.get_lobby_type(od_match["lobby_type"])
    match["region"] = translate.get_region(od_match["region"])
    match["skill"] = translate.get_skill(od_match["skill"])
    match["duration"] = od_match["duration"] // 60
    match["game_mode"] = translate.get_game_mode(od_match["game_mode"])
    player_data = translate.get_player_data(od_match["players"])
    match["players"] = player_data

    logger.info("Retrieved match: " + json.dumps(match))
    return generate_response(200, json.dumps(match))
