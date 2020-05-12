# Get Dota 2 Match

Get all public Dota 2 matches of a Steam account.

**URL** : `/matches/players/{steam_id}`

**Method** : `GET`

**URL Params** :

Required

| Attribute | Type    | Description     |
| :-------- | :------ | :-------------- |
| match_id  | integer | dota 2 match id |

## Success Response

**Code** : `200 OK`

**Content** :

```json
[
    {
        "match_id": 2189124351,
        "radiant_win": false,
        "duration": 15,
        "game_mode": "All Pick",
        "lobby_type": "Public matchmaking",
        "hero_id": 30,
        "start_time": 1456830505,
        "kills": 1,
        "deaths": 1,
        "assists": 7,
        "skill": "Unknown Skill",
        "party_size": 2,
        "hero_img": "http://cdn.dota2.com//apps/dota2/images/heroes/witch_doctor_full.png?",
        "hero_name": "Witch Doctor",
        "team": "Dire"
    },
    {
        "match_id": 2116846229,
        "radiant_win": false,
        "duration": 74,
        "game_mode": "All Pick",
        "lobby_type": "Public matchmaking",
        "hero_id": 91,
        "start_time": 1456383845,
        "kills": 0,
        "deaths": 2,
        "assists": 9,
        "skill": "Unknown Skill",
        "party_size": null,
        "hero_img": "http://cdn.dota2.com//apps/dota2/images/heroes/wisp_full.png?",
        "hero_name": "Io",
        "team": "Dire"
    },
    {
        "match_id": 2151662530,
        "radiant_win": true,
        "duration": 35,
        "game_mode": "All Pick",
        "lobby_type": "Public matchmaking",
        "hero_id": 5,
        "start_time": 1455532008,
        "kills": 4,
        "deaths": 4,
        "assists": 16,
        "skill": "Unknown Skill",
        "party_size": 3,
        "hero_img": "http://cdn.dota2.com//apps/dota2/images/heroes/crystal_maiden_full.png?",
        "hero_name": "Crystal Maiden",
        "team": "Radiant"
    }
]
```
