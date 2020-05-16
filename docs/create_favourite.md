# Create Favourite match

Create a favourite match for a Dota Clarity user.

**URL** : `/matches/favourites`

**Method** : `POST`

**Auth required** : YES

**Headers** :

Required

| Header        | Description                    |
| :------------ | :----------------------------- |
| Authorization | cognito user pool access token |

**Data Params** :

Generate a valid payload by performing a GET at `/matches/{match_id}` where you can then add a steam_id and id to the response match data.

Required

| Attribute     | Type    |
| :------------ | :------ |
| id            | string  |
| steam_id      | integer |
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
  "id": "4ae52f50-34b2-4f22-8916-5126a64522ce",
  "match_id": 5392211187
}
```
