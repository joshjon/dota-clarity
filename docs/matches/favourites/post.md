# Create Favourite match

Create a favourite match for a Dota Clarity user.

**URL** : `/matches/favourites/{id}`

**Method** : `POST`

**URL Params** :

Required

| Attribute | Type    | Description        |
| :-------- | :------ | :----------------- |
| steam_id  | integer | steam32 account id |

**Data Params** :

A valid payload should be generated using the get `/matches/{match_id}` API.

Required

| Attribute     | Type    |
| :------------ | :------ |
| match_id      | integer |
| dire_score    | integer |
| duration      | integer |
| game_mode     | string  |
| radiant_score | integer |
| radiant_win   | boolean |
| start_time    | integer |
| skill         | string  |
| region        | string  |
| replay_url    | string  |
| match_id      | integer |
| lobby_type    | string  |
| players       | Array   |

## Success Response

**Code** : `201 CREATED`

**Content** :

```json
{
  "id": "bestdotaplayer@dota.com",
  "match_id": 5392211187
}
```
