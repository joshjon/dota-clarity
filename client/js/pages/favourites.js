/* 
 * Global var 
 */
var App = window.App || {};

/*
 * Page setup
 */

var matches = []

$(document).ready(function () {
    // Setup matches data table
    var t = $('#matches-table').DataTable({
        "order": [[1, "desc"]],
        "iDisplayLength": 25,
        "columnDefs": [
            { "type": "display", "targets": 1, render: $.fn.dataTable.render.moment('Do MMM YYYYY') },
            { "orderable": false, "targets": [0, 3, 4, 5, 6] }
        ]
    });
    populateFavouritesTable($('#matches-table'))
});

/*
 * Handlers
 */

$(document).on("click", "#matches-table .delete-btn", function () {
    var row = $(this).closest("tr")
    var matchId = row.find("#match-id").text()
    deleteFavouriteMatch(getCogntioUsername(), matchId).then(() => {
        row.remove()
    })
});

$('#matches-table').on('click', 'tbody > tr > td', function () {
    // Ensure delete btn does not open match window
    if ($(this).index() == 0) { return; }

    var row = $(this).closest("tr")
    var matchId = row.find("#match-id").text()
    $("#radiant-team tbody").empty();
    $("#dire-team-tbody").empty();
    $("#stats-row-modal").empty()

    var data = {}
    for (i in matches) {
        if (matches[i].match_id == matchId) {
            data = matches[i]
            break
        }
    }

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
});

/*
 * Helpers
 */

async function populateFavouritesTable(table) {
    matches = await getAllFavouriteMatches(getCogntioUsername())
    $.each(matches, function (i, item) {
        table.DataTable().row.add(getColumns(item)).draw(false);
    });
}

function getColumns(match) {
    var deleteButton = '<button type="button" id="delete-btn" class="btn btn-danger btn-lg delete-btn" \
        aria-pressed="false"> <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> \</button>'

    var hero = '<img src="' + match.hero_img + '">'
    var duration = match.duration + " mins"
    var date = new Date(0)
    date.setUTCSeconds(match.start_time)
    var result = "Lost"
    if ((match.team == "Radiant" && match.radiant_win == true) || (match.team == "Dire" && match.radiant_win == false)) {
        result = "Won"
    }
    matchId = '<p id="match-id">' + match.match_id + '</p>'

    // Order matches column headings
    return [deleteButton, date, matchId, result, hero, match.game_mode, match.lobby_type, duration, match.kills, match.deaths, match.assists]
}

function generatePlayerRow(player) {
    var newRow = $('<tr class="player-row"></tr>')
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