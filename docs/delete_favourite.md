# Delete Favourite Match

Delete a favourite match of a Dota Clarity user.

**URL** : `/matches/favourites/{id}/{match_id}`

**Method** : `DELETE`

**Auth required** : YES

**URL Params** :

Required

| Attribute | Type    | Description                       |
| :-------- | :------ | :-------------------------------- |
| id        | string  | user id of a dota clarity account |
| match_id  | integer | dota 2 match id                   |

**Headers** :

Required

| Header        | Description                    |
| :------------ | :----------------------------- |
| Authorization | cognito user pool access token |

## Success Responses

**Code** : `202 OK`

**Content** :

```json
{}
```
