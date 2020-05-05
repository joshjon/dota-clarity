# Create Dota Clarity Profile

Create a profile for a Dota Clarity user.

**URL** : `/profiles`

**Method** : `POST`

**Data Params** :

Required

| Attribute | Type         | Description             |
| :-------- | :----------- | :---------------------- |
| id        | string       | user id of an account   |
| steamid   | string       | steam32 account ID      |
| roles     | string array | roles that a user plays |
| age       | integer      | age of a user           |

## Success Response

**Code** : `201 CREATED`

**Content example**

```json
{
  "id": "bestdotaplayer@dota.com",
  "steamid": "12345678"
}
```
