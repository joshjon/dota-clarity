import json

class Translator:
    def get_hero_data(self, hero_id):
        f = open('heroes.json')
        heroes = json.load(f)
        for hero in heroes:
            if hero["id"] == hero_id:
                hero_data = {}
                hero_data["hero_img"] = "http://cdn.dota2.com/" + hero["img"]
                hero_data["hero_name"] = hero["localized_name"]
                return hero_data

    def get_lobby_type(self, lobby_type_id):
        lobby_types = {
            -1: "Invalid",
            0: "Public matchmaking",
            1: "Practice",
            2: "Tournament",
            3: "Tutorial",
            4: "Co-op with bots",
            5: "Team match",
            6: "Solo queue",
            7: "Ranked",
            8: "Solo mid 1 vs. 1",
            9 : "Battle Cup"
        }
        return lobby_types[lobby_type_id]
    
    def get_team(self, player_slot):
        if player_slot is None: return "Unknown"
        return "Radiant" if player_slot <= 127 else "Dire"

    def get_game_mode(self, game_mode_id):
        if game_mode_id is None:
            return "Unknown"
        f = open('game-mode.json')
        game_mode_data = json.load(f)
        return game_mode_data[str(game_mode_id)]

    def get_skill(self, skill_id):
        skills = {
            0: "Unknown Skill",
            1: "Normal Skill",
            2: "High Skill",
            3: "Very High Skill"
        }
        if skill_id is None:
            return skills[0]
        else:
            return skills[skill_id]

    def get_region(self, region_id):
        f = open("region.json")
        region_data = json.load(f)
        return region_data[str(region_id)]

    def get_rank_tier(self, rank_tier_id):
        rank_tiers = {
            0: "Uncalibrated",
            1: "Herald",
            2: "Guardian",
            3: "Crusader",
            4: "Archon",
            5: "Legend",
            6: "Ancient",
            7: "Divine",
            8: "Immortal"
        }
        if rank_tier_id is None:
            return "Unknown"
        else:
            return rank_tiers[rank_tier_id]

    def get_player_data(self, player_data):
        keep = ("account_id", "assists", "deaths", "denies", "gold", "gold_per_min", "hero_damage", "hero_healing", "hero_id", "kills",
                "last_hits", "level", "xp_per_min", "tower_damage", "personaname", "isRadiant", "total_gold", "total_xp", "rank_tier")
        players = []
        for player in player_data:
            filtered_player = {k: player[k] for k in keep if k in player}
            # Translate rank tier
            if filtered_player["rank_tier"] is not None:
                rank_id = filtered_player["rank_tier"] // 10
                filtered_player["rank_tier"] = self.get_rank_tier(rank_id)
            else:
                filtered_player["rank_tier"] = "Unknown"
            # Translate hero data
            hero_data = self.get_hero_data(filtered_player["hero_id"])
            filtered_player.update(hero_data)
            # Handle null names
            if "personaname" not in filtered_player:
                filtered_player["personaname"] = "Anonymous"
            # Add player data to list of players
            players.append(filtered_player)
        return players
