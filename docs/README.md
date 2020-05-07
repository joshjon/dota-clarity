## Dota Clarity REST API Resources

### Profiles

A profile is the public profile that is associated to a Dota Clarity account.

- **[<code>GET</code> Profile](/docs/profiles/get.md)**
- **[<code>POST</code> Create Profile](/docs/profiles/post.md)**

### Matches

A match is a public Dota 2 match retreived via the [OpenDota API](https://docs.opendota.com/). Upon retrieval, match data is transformed to use the Dota Clarity match schema. A match can also be saved to the favourites list of a Dota clarity user.

- **[<code>GET</code> Match](/docs/matches/get.md)**
- **[<code>GET</code> Favourite Match](/docs/matches/favourites/get.md)**
- **[<code>GET</code> All Favourite Matches](/docs/matches/favourites/get_all.md)**
- **[<code>POST</code> Create Favourite Match](/docs/matches/favourites/post.md)**
