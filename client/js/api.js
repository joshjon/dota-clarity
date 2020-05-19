var App = window.App || {};
var storageKey = "dota-clarity-matches"
var sessionExpiryMins = 15

/* 
 * Matches API
 */

async function getMatch(matchId) {
    var token = await App.authToken;
    return await $.ajax({
        beforeSend: function (request) {
            request.setRequestHeader('Authorization', token);
        },
        url: _config.api.url + 'matches/' + matchId,
        method: 'GET',
        dataType: 'json'
    });
}

// Stores API response in session for 5 minutes before making another request
async function getPlayerMatches(steamId, offset = 0) {
    var data = JSON.parse(sessionStorage.getItem(storageKey));
    if (data) {
        now = new Date();
        expiration = new Date(data.timestamp);
        expiration.setMinutes(expiration.getMinutes() + sessionExpiryMins);
        // Remove from session if older than 5 minutes
        if (now.getTime() > expiration.getTime()) {
            data = false;
            sessionStorage.removeItem(storageKey);
        }
    }
    if (!data) {
        var token = await App.authToken;
        var matches = await $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader('Authorization', token);
            },
            url: _config.api.url + 'matches/players/' + steamId + '?offset=' + offset,
            method: 'GET',
            dataType: 'json'
        });
        data = {
            timestamp: new Date(),
            matches: matches
        }
        sessionStorage.setItem("dota-clarity-matches", JSON.stringify(data))
    }
    return data.matches;
}

async function createFavouriteMatch(body) {
    data = JSON.stringify(body)
    var token = await App.authToken;
    return await $.ajax({
        beforeSend: function (request) {
            request.setRequestHeader('Authorization', token);
        },
        url: _config.api.url + 'matches/favourites',
        method: 'POST',
        data: data,
        dataType: 'json'
    });
}

async function getFavouriteMatch(id, matchId) {
    var token = await App.authToken;
    return await $.ajax({
        beforeSend: function (request) {
            request.setRequestHeader('Authorization', token);
        },
        url: _config.api.url + 'matches/favourites/' + id + '/' + matchId,
        method: 'GET',
        dataType: 'json'
    });
}

async function getAllFavouriteMatches(id) {
    var token = await App.authToken;
    return await $.ajax({
        beforeSend: function (request) {
            request.setRequestHeader('Authorization', token);
        },
        url: _config.api.url + 'matches/favourites/' + id,
        method: 'GET',
        dataType: 'json'
    });
}

async function deleteFavouriteMatch(id, matchId) {
    var token = await App.authToken;
    return await $.ajax({
        beforeSend: function (request) {
            request.setRequestHeader('Authorization', token);
        },
        url: _config.api.url + 'matches/favourites/' + id + '/' + matchId,
        method: 'DELETE',
        dataType: 'text'
    });
}

/* 
 * Player stats
 */

function getPlayerTotals(steamId) {
    return $.ajax({
        url: 'https://api.opendota.com/api/players/' + steamId + '/totals',
        method: 'GET',
        dataType: 'json'
    });
}

function getWinLoss(steamId) {
    return $.ajax({
        url: 'https://api.opendota.com/api/players/' + steamId + '/wl',
        method: 'GET',
        dataType: 'json'
    });
}
