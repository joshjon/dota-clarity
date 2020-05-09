import json
import logging
import requests
from odtranslator import Translator

logger = logging.getLogger()
logger.setLevel(logging.INFO)
translator = Translator()

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

def get_all_open_dota_matches(steam_id):
    headers = {"Content-Type": "application/json"}
    opendota_url = "https://api.opendota.com/api/players/" + steam_id + "/matches?sort"
    return requests.get(opendota_url, headers=headers)
    

def lambda_handler(event, context):
    steam_id = event['pathParameters']['steam_id']
    od_response = get_all_open_dota_matches(steam_id)
    
    if od_response.status_code != 200:
        message = "No matches are affiliated with the steam ID " + steam_id
        logger.error(message)
        return generate_response(404, message)
    
    all_matches = json.loads(od_response.text)

    if not all_matches:
        return generate_response(200, [])

    for match in all_matches:
        # Transform values
        match["team"] = translator.get_team(match["player_slot"])
        match["lobby_type"] = translator.get_lobby_type(match["lobby_type"])
        match["skill"] = translator.get_skill(match["skill"])
        match["duration"] = match["duration"] // 60
        match["game_mode"] = translator.get_game_mode(match["game_mode"])
        match.update(translator.get_hero_data(match["hero_id"]))
        # Remove unwanted keys
        match.pop("player_slot", None)
        match.pop("version", None)
        match.pop("leaver_status", None)

    logger.info("Retrieved match: " + json.dumps(all_matches))
    return generate_response(200, json.dumps(all_matches))
