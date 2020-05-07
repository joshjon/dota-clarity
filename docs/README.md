## Dota Clarity REST API Resources

### Profiles

A profile is the public profile that is associated to a Dota Clarity account.

- **[<code>GET</code> Profile](/profiles/get.md)**
- **[<code>POST</code> Create Profile](/profiles/post.md)**

### Matches

A match is a public Dota 2 match retreived via the [OpenDota API](https://docs.opendota.com/). Upon retrieval, match data is transformed to use the Dota Clarity match schema. A match can also be saved to the favourites list of a Dota clarity user.

- **[<code>GET</code> Match](/matches/get.md)**
- **[<code>GET</code> Favourite Match](/matches/favourites/get.md)**
- **[<code>GET</code> All Favourite Matches](/matches/favourites/get_all.md)**
- **[<code>POST</code> Create Favourite Match](/matches/favourites/post.md)**
