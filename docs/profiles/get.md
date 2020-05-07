# Get Dota Clarity Profile

Get the profile of a Dota Clarity user.

**URL** : `/profiles/{id}`

**Method** : `GET`

**URL Params** :

Required

| Attribute | Type   | Description                       |
| :-------- | :----- | :-------------------------------- |
| id        | string | user id of a dota clarity account |

## Success Responses

**Code** : `200 OK`

**Content** :

```json
{
  "steamid": "12345678",
  "country_code": "AU",
  "mmr": 2375,
  "rank_tier": 21,
  "roles": ["Support", "Hard Support"],
  "id": "bestdotaplayer@dota.com",
  "avatar": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/e2/123456789.jpg",
  "age": 25,
  "steam_url": "https://steamcommunity.com/id/bestdotaplayer/"
}
```
