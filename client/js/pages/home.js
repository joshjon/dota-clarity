/* 
 * Global var 
 */
var App = window.App || {};

/*
 * Page setup
 */

$(document).ready(function () {
    // Setup player stats
    getCognitoSteamId().then(steamId => {
        getPlayerStats(steamId).then(data => {
            var winrate = Math.round((data.win / (data.win + data.lose)) * 100)
            var wl = generateStatsCard("Win / Loss", "Wins: " + data.win, "Losses: " + data.lose, "Winrate: " + winrate + '%')
            var kda = generateStatsCard("Total KDA", "Kills: " + data.kills.sum, "Deaths: " + data.deaths.sum, "Assists: " + data.assists.sum)
            var avgKda = generateStatsCard("Avg KDA", "Kills: " + data.avg_kills, "Deaths: " + data.avg_deaths, "Assists: " + data.avg_assists)
            var performance = generateStatsCard("Avg Performance", "GPM: " + data.avg_gold_per_min, "Last hits: " + data.avg_last_hits, "Denies: " + data.avg_denies)
            var dmg = generateStatsCard("Avg Damage / Heals", "Damage: " + data.avg_hero_damage, "Healing: " + data.avg_hero_healing, "Tower Damage: " + data.avg_tower_damage)
            var misc = generateStatsCard("Misc.", "Courier kills: " + data.courier_kills.sum, "Rapiers purchased: " + data.purchase_rapier.sum, "Pings: " + data.pings.sum)
            $("#stats-row").append(wl);
            $("#stats-row").append(kda);
            $("#stats-row").append(avgKda);
            $("#stats-row").append(performance);
            $("#stats-row").append(dmg);
            $("#stats-row").append(misc);
        })
    })

    // Setup matches data table
    var t = $('#matches-table').DataTable({
        "order": [[1, "desc"]],
        "iDisplayLength": 25,
        "processing": true,
        "columnDefs": [
            { "type": "display", "targets": 1, render: $.fn.dataTable.render.moment('Do MMM YYYYY') },
            { "orderable": false, "targets": [0, 3, 4, 5, 6] }
        ]
    });

    $('#loader').show()
    $('#matches-table').hide()
    // Populate table with player matches
    getCognitoSteamId().then(steamId => {
        getPlayerMatches(steamId).then(response => {
            $.each(response.items, function (i, item) {
                t.row.add(getColumns(item)).draw(false);
            });
            $('#loader').hide()
            $('#matches-table').show()
        });
    })
    // $('#home-table-loader').hide()


});

/*
 * Handlers
 */

$(document).on("click", ".fav-btn", function () {
    var row = $(this).closest("tr")
    var matchId = row.find("#match-id").text()
    var kills = row.find("#kills").text()
    var deaths = row.find("#deaths").text()
    var assists = row.find("#assists").text()
    var heroImage = row.find("#player-hero-image").attr('src')
    getMatch(matchId).then(data => {
        getCognitoSteamId().then(steamId => {
            data.id = getCogntioUsername()
            data.steamid = steamId
            data.hero_img = heroImage
            data.kills = kills
            data.deaths = deaths
            data.assists = assists
            createFavouriteMatch(data)
        })
    })
});

$('#matches-table').on('click', 'tbody > tr > td', function () {
    // Ensure fav btn does not open match window
    if ($(this).index() == 0) { return; }

    var row = $(this).closest("tr")
    var matchId = row.find("#match-id").text()
    $("#radiant-team tbody").empty()
    $("#dire-team-tbody").empty()
    $("#stats-row-modal").empty()

    getMatch(matchId).then(data => {
        $('#modal-title').text("Match ID: " + matchId)
        var winner = data.radiant_win ? "Radiant" : "Dire"
        var result = generateStatsCard("Result", "Winner: " + winner, "Radiant: " + data.radiant_score, "Dire: " + data.dire_score)
        var details = generateStatsCard("Details", "Duration: " + data.duration + " mins", "Mode: " + data.game_mode, "Lobby type: " + data.lobby_type)
        var replay = generateReplayCard("Replay", 'You can download your replay <a id="replay-link" href="' + data.replay_url + '">here</a>. <br>To watch the game, extract the archive and place the .dem file in your Dota 2 replays directory (under steamapps).')
        $("#stats-row-modal").append(result);
        $("#stats-row-modal").append(details);
        $("#stats-row-modal").append(replay);

        for (i in data.players) {
            var player = data.players[i]
            var row = generatePlayerRow(player)
            if (player.isRadiant) {
                $('#radiant-team-tbody').append(row);
            } else {
                $('#dire-team-tbody').append(row);
            }
        }
        $('.modal').modal('show')
    })
});

/*
 * Helpers
 */

function getColumns(match) {
    var favButton = '<button type="button" id="fav-btn" class="btn btn-danger btn-lg fav-btn" \
        data-toggle="button" aria-pressed="false"> <span class="glyphicon glyphicon-heart" aria-hidden="true"></span> \</button>'

    var hero = '<img src="' + match.hero_img + '" id="player-hero-image">'
    var duration = match.duration + " mins"
    var date = new Date(0)
    date.setUTCSeconds(match.start_time)
    var result = "Lost"
    if ((match.team == "Radiant" && match.radiant_win == true) || (match.team == "Dire" && match.radiant_win == false)) {
        result = "Won"
    }
    kills = '<p id="kills">' + match.kills + '</p>'
    deaths = '<p id="deaths">' + match.deaths + '</p>'
    assists = '<p id="assists">' + match.assists + '</p>'
    matchId = '<p id="match-id">' + match.match_id + '</p>'

    // Order matches column headings
    return [favButton, date, matchId, result, hero, match.game_mode, match.lobby_type, duration, kills, deaths, assists]
}

function generatePlayerRow(player) {
    var newRow = $("<tr></tr>")
    var cols = ""
    cols += '<td> <img src="' + player.hero_img + '"/></td>'
    cols += '<td>' + player.personaname + '</td>'
    cols += '<td>' + player.rank_tier + '</td>'
    cols += '<td>' + player.level + '</td>'
    cols += '<td>' + player.kills + '</td>'
    cols += '<td>' + player.deaths + '</td>'
    cols += '<td>' + player.assists + '</td>'
    cols += '<td>' + player.last_hits + ' / ' + player.denies + '</td>'
    cols += '<td>' + player.total_gold + '</td>'
    cols += '<td>' + player.gold_per_min + ' / ' + player.xp_per_min + '</td>'
    cols += '<td>' + player.hero_damage + '</td>'
    cols += '<td>' + player.hero_healing + '</td>'
    cols += '<td>' + player.tower_damage + '</td>'
    newRow.append(cols)
    return newRow
}