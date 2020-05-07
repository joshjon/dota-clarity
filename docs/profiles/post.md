# Create Dota Clarity Profile

Create a profile for a Dota Clarity user.

**URL** : `/profiles`

**Method** : `POST`

**Data Params** :

Required

| Attribute | Type         | Description                       |
| :-------- | :----------- | :-------------------------------- |
| id        | string       | user id of a dota clarity account |
| steamid   | string       | steam32 account id                |
| roles     | string array | roles that a user plays           |
| age       | integer      | age of a user                     |

## Success Response

**Code** : `201 CREATED`

**Content** :

```json
{
  "id": "bestdotaplayer@dota.com",
  "steamid": "12345678"
}
```
