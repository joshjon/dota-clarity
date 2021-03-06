# Get Dota 2 Match

Get any public Dota 2 match.

**URL** : `/matches/{match_id}`

**Method** : `GET`

**Auth required** : YES

**URL Params** :

Required

| Attribute | Type    | Description     |
| :-------- | :------ | :-------------- |
| match_id  | integer | dota 2 match id |

**Headers** :

Required

| Header        | Description                    |
| :------------ | :----------------------------- |
| Authorization | cognito user pool access token |

## Success Response

**Code** : `200 OK`

**Content** :

```json
{
  "dire_score": 7,
  "duration": 28,
  "game_mode": "All Draft",
  "radiant_score": 26,
  "radiant_win": true,
  "start_time": 1588426700,
  "skill": "Normal Skill",
  "region": "Australia",
  "replay_url": "http://replay171.valve.net/570/5392211187_1359313108.dem.bz2",
  "match_id": 5392211187,
  "lobby_type": "Ranked",
  "players": [
    {
      "account_id": 246169915,
      "assists": 9,
      "deaths": 1,
      "denies": 14,
      "gold": 223,
      "gold_per_min": 396,
      "hero_damage": 13311,
      "hero_healing": 0,
      "hero_id": 129,
      "kills": 6,
      "last_hits": 109,
      "level": 15,
      "xp_per_min": 397,
      "tower_damage": 3077,
      "personaname": "\u30eb\u30fc\u30af",
      "isRadiant": true,
      "total_gold": 11160,
      "total_xp": 11188,
      "rank_tier": "Crusader",
      "hero_img": "http://cdn.dota2.com//apps/dota2/images/heroes/mars_full.png?",
      "hero_name": "Mars"
    },
    {
      "account_id": 197329032,
      "assists": 6,
      "deaths": 2,
      "denies": 5,
      "gold": 73,
      "gold_per_min": 510,
      "hero_damage": 16683,
      "hero_healing": 0,
      "hero_id": 74,
      "kills": 6,
      "last_hits": 178,
      "level": 18,
      "xp_per_min": 566,
      "tower_damage": 8540,
      "personaname": "BeetleJuice",
      "isRadiant": true,
      "total_gold": 14373,
      "total_xp": 15951,
      "rank_tier": "Ancient",
      "hero_img": "http://cdn.dota2.com//apps/dota2/images/heroes/invoker_full.png?",
      "hero_name": "Invoker"
    },
    {
      "account_id": 64883934,
      "assists": 12,
      "deaths": 2,
      "denies": 2,
      "gold": 2267,
      "gold_per_min": 303,
      "hero_damage": 10250,
      "hero_healing": 3499,
      "hero_id": 128,
      "kills": 1,
      "last_hits": 38,
      "level": 14,
      "xp_per_min": 372,
      "tower_damage": 2020,
      "personaname": "Goal u some 8",
      "isRadiant": true,
      "total_gold": 8539,
      "total_xp": 10484,
      "rank_tier": "Crusader",
      "hero_img": "http://cdn.dota2.com//apps/dota2/images/heroes/snapfire_full.png?",
      "hero_name": "Snapfire"
    },
    {
      "account_id": 35874311,
      "assists": 15,
      "deaths": 1,
      "denies": 3,
      "gold": 3173,
      "gold_per_min": 293,
      "hero_damage": 12665,
      "hero_healing": 0,
      "hero_id": 84,
      "kills": 4,
      "last_hits": 41,
      "level": 14,
      "xp_per_min": 360,
      "tower_damage": 1562,
      "personaname": "I like turtles",
      "isRadiant": true,
      "total_gold": 8257,
      "total_xp": 10146,
      "rank_tier": "Crusader",
      "hero_img": "http://cdn.dota2.com//apps/dota2/images/heroes/ogre_magi_full.png?",
      "hero_name": "Ogre Magi"
    },
    {
      "account_id": 191957745,
      "assists": 9,
      "deaths": 1,
      "denies": 19,
      "gold": 1324,
      "gold_per_min": 492,
      "hero_damage": 16787,
      "hero_healing": 0,
      "hero_id": 104,
      "kills": 9,
      "last_hits": 147,
      "level": 16,
      "xp_per_min": 481,
      "tower_damage": 8598,
      "personaname": "misos",
      "isRadiant": true,
      "total_gold": 13866,
      "total_xp": 13556,
      "rank_tier": "Legend",
      "hero_img": "http://cdn.dota2.com//apps/dota2/images/heroes/legion_commander_full.png?",
      "hero_name": "Legion Commander"
    },
    {
      "account_id": null,
      "assists": 2,
      "deaths": 5,
      "denies": 5,
      "gold": 949,
      "gold_per_min": 289,
      "hero_damage": 9727,
      "hero_healing": 0,
      "hero_id": 39,
      "kills": 0,
      "last_hits": 116,
      "level": 15,
      "xp_per_min": 433,
      "tower_damage": 61,
      "isRadiant": false,
      "total_gold": 8144,
      "total_xp": 12203,
      "rank_tier": "Unknown",
      "hero_img": "http://cdn.dota2.com//apps/dota2/images/heroes/queenofpain_full.png?",
      "hero_name": "Queen of Pain",
      "personaname": "Anonymous"
    },
    {
      "account_id": null,
      "assists": 3,
      "deaths": 6,
      "denies": 0,
      "gold": 650,
      "gold_per_min": 222,
      "hero_damage": 19076,
      "hero_healing": 0,
      "hero_id": 31,
      "kills": 4,
      "last_hits": 25,
      "level": 12,
      "xp_per_min": 276,
      "tower_damage": 0,
      "isRadiant": false,
      "total_gold": 6256,
      "total_xp": 7778,
      "rank_tier": "Unknown",
      "hero_img": "http://cdn.dota2.com//apps/dota2/images/heroes/lich_full.png?",
      "hero_name": "Lich",
      "personaname": "Anonymous"
    },
    {
      "account_id": 51416407,
      "assists": 5,
      "deaths": 5,
      "denies": 5,
      "gold": 514,
      "gold_per_min": 189,
      "hero_damage": 5416,
      "hero_healing": 2232,
      "hero_id": 66,
      "kills": 1,
      "last_hits": 58,
      "level": 11,
      "xp_per_min": 232,
      "tower_damage": 855,
      "personaname": "Hao",
      "isRadiant": false,
      "total_gold": 5326,
      "total_xp": 6538,
      "rank_tier": "Crusader",
      "hero_img": "http://cdn.dota2.com//apps/dota2/images/heroes/chen_full.png?",
      "hero_name": "Chen"
    },
    {
      "account_id": null,
      "assists": 3,
      "deaths": 5,
      "denies": 7,
      "gold": 1741,
      "gold_per_min": 310,
      "hero_damage": 6373,
      "hero_healing": 0,
      "hero_id": 70,
      "kills": 0,
      "last_hits": 147,
      "level": 15,
      "xp_per_min": 420,
      "tower_damage": 83,
      "isRadiant": false,
      "total_gold": 8736,
      "total_xp": 11837,
      "rank_tier": "Unknown",
      "hero_img": "http://cdn.dota2.com//apps/dota2/images/heroes/ursa_full.png?",
      "hero_name": "Ursa",
      "personaname": "Anonymous"
    },
    {
      "account_id": 68726794,
      "assists": 3,
      "deaths": 5,
      "denies": 2,
      "gold": 285,
      "gold_per_min": 256,
      "hero_damage": 12834,
      "hero_healing": 0,
      "hero_id": 2,
      "kills": 1,
      "last_hits": 91,
      "level": 13,
      "xp_per_min": 332,
      "tower_damage": 0,
      "personaname": "Hish",
      "isRadiant": false,
      "total_gold": 7214,
      "total_xp": 9356,
      "rank_tier": "Guardian",
      "hero_img": "http://cdn.dota2.com//apps/dota2/images/heroes/axe_full.png?",
      "hero_name": "Axe"
    }
  ]
}
```
