import json


class Translator:
    def get_hero_data(self, hero_id):
        f = open('heroes.json')
        heroes = json.load(f)
        for hero in heroes:
            if hero["id"] == hero_id:
                hero_data = {}
                hero_data["hero_img"] = "http://cdn.dota2.com/"+ hero["img"]
                hero_data["hero_name"] = hero["localized_name"]
                return hero_data

    def get_lobby_type(self, lobby_type_id):
        f = open('lobby-type.json')
        lobby_type_data = json.load(f)
        for lobby_type in lobby_type_data:
            if lobby_type["id"] == lobby_type_id:
                return lobby_type["name"]
        return "Unknown"

    def get_player_data(self, player_data):
        keep = ("account_id", "assists", "deaths", "denies", "gold", "gold_per_min", "hero_damage", "hero_healing", "hero_id", "kills",
                "last_hits", "level", "xp_per_min", "tower_damage", "personname", "isRadiant", "total_gold", "total_xp", "rank_tier")
        filtered_player_data = []
        for player in player_data:
            filtered = {k: player[k] for k in keep if k in player}
            hero_data = self.get_hero_data(filtered["hero_id"])
            filtered.update(hero_data)
            filtered_player_data.append(filtered)
        return filtered_player_data

# TODO: duration to minutes, game mode, start time to minutes, leaver status.....
# I think there is more details when actually getting a specific match by id rather than getting a match when listing all patches for a user
