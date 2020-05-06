import json

def get_hero_name(hero_id):
    f = open('heroes.json')
    hero_data = json.load(f)
    for hero in hero_data: 
        if hero["id"] == hero_id:
            name = hero["name"].replace("npc_dota_hero_", "")
            name = name.replace("_", " ")
            return name.title()
    return "Unknown"

def get_lobby_type(lobby_type_id):
    f = open('lobby-type.json')
    lobby_type_data = json.load(f)
    for lobby_type in lobby_type_data: 
        if lobby_type["id"] == lobby_type_id:
            return lobby_type["name"]
    return "Unknown"


# TODO: duration to minutes, game mode, start time to minutes, leaver status..... 
# I think there is more details when actually getting a specific match by id rather than getting a match when listing all patches for a user 