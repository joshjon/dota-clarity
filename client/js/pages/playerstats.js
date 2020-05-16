function generateStatsCard(title, string1, string2, string3) {
    return '<div class="col-md-2"> \
                <div class=> \
                    <div class="card-body"> \
                        <h5 id="stat-card-title" class="card-title">' + title + '</h5> \
                        <p class="card-text">' + string1 + '<br>' + string2 + '<br>' + string3 + '</p> \
                    </div> \
                </div> \
            </div>'
}

function generateReplayCard(title, string) {
    return '<div class="col-md-4"> \
                <div class=> \
                    <div class="card-body"> \
                        <h5 id="stat-card-title" class="card-title">' + title + '</h5> \
                        <p class="card-text">' + string + '</p> \
                    </div> \
                </div> \
            </div>'
}

async function getPlayerStats(steamId) {
    var data = {}

    var winLoss = await getWinLoss(steamId)
    data.win = winLoss.win;
    data.lose = winLoss.lose;


    var totalsList = await getPlayerTotals(steamId)
    keys = new Set([
        "kills",
        "deaths",
        "assists",
        "kda",
        "gold_per_min",
        "last_hits",
        "denies",
        "duration",
        "hero_damage",
        "tower_damage",
        "hero_healing",
        "purchase_rapier",
        "pings",
        "courier_kills"
    ]);

    for (i in totalsList) {
        var item = totalsList[i]
        if (keys.has(item.field)) {
            data[item.field] = {
                "range": item.n,
                "sum": item.sum
            }
        }
    }

    data.avg_kills = Math.round(data.kills.sum / data.kills.range)
    data.avg_deaths = Math.round(data.deaths.sum / data.deaths.range)
    data.avg_assists = Math.round(data.assists.sum / data.assists.range)
    data.avg_kda = Math.round(data.kda.sum / data.kda.range)
    data.avg_gold_per_min = Math.round(data.gold_per_min.sum / data.gold_per_min.range)
    data.avg_last_hits = Math.round(data.last_hits.sum / data.last_hits.range)
    data.avg_denies = Math.round(data.denies.sum / data.denies.range)
    data.avg_duration = Math.round(data.duration.sum / data.duration.range)
    data.avg_hero_damage = Math.round(data.hero_damage.sum / data.hero_damage.range)
    data.avg_tower_damage = Math.round(data.tower_damage.sum / data.tower_damage.range)
    data.avg_hero_healing = Math.round(data.hero_healing.sum / data.hero_healing.range)
    return data
}