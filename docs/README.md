## Dota Clarity REST API Resources

### Profiles

A profile is the public profile that is associated with a a Dota Clarity account.

- **[<code>GET</code> Profile](/docs/profiles/get.md)**
- **[<code>POST</code> Create Profile](/docs/profiles/post.md)**

### Matches

A match is a public Dota 2 match retrieved via the [OpenDota API](https://docs.opendota.com/). Upon retrieval, match data is transformed to align with Dota Clarity's expected match schema. A match can also be saved to the favourites list of a Dota clarity user.

- **[<code>GET</code> Match](/docs/matches/get.md)**
- **[<code>GET</code> All Matches](/docs/matches/get_all.md)**
- **[<code>GET</code> Favourite Match](/docs/matches/favourites/get.md)**
- **[<code>GET</code> All Favourite Matches](/docs/matches/favourites/get_all.md)**
- **[<code>POST</code> Create Favourite Match](/docs/matches/favourites/post.md)**
