var App = window.App || {};
var matchKey = "dota-clarity-matches"
var playerKey = "dota-clarity-player-totals"
var winLossKey = "dota-clarity-win-loss"
var sessionExpiryMins = 10

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

// Stores API response in session for 10 minutes before making another request
async function getPlayerMatches(steamId, offset = 0) {
    var key = generateKey(matchKey)
    var data = JSON.parse(sessionStorage.getItem(key));
    if (data) {
        now = new Date();
        expiration = new Date(data.timestamp);
        expiration.setMinutes(expiration.getMinutes() + sessionExpiryMins);
        // Remove from session of older than 10 minutes
        if (now.getTime() > expiration.getTime()) {
            data = false;
            sessionStorage.removeItem(key);
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
        sessionStorage.setItem(generateKey(matchKey), JSON.stringify(data))
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

 // Stores API response in session for 10 minutes before making another request
async function getPlayerTotals(steamId) {
    var key = generateKey(playerKey)
    var data = JSON.parse(sessionStorage.getItem(key));
    if (data) {
        now = new Date();
        expiration = new Date(data.timestamp);
        expiration.setMinutes(expiration.getMinutes() + sessionExpiryMins);
        // Remove from session of older than 10 minutes
        if (now.getTime() > expiration.getTime()) {
            data = false;
            sessionStorage.removeItem(key);
        }
    }
    if (!data) {
        var totals = await $.ajax({
            url: 'https://api.opendota.com/api/players/' + steamId + '/totals',
            method: 'GET',
            dataType: 'json'
        });
        data = {
            timestamp: new Date(),
            totals: totals
        }
        sessionStorage.setItem(generateKey(playerKey), JSON.stringify(data))
    }
    return data.totals;
}

// Stores API response in session for 10 minutes before making another request
async function getWinLoss(steamId) {
    var key = generateKey(winLossKey)
    var data = JSON.parse(sessionStorage.getItem(key));
    if (data) {
        now = new Date();
        expiration = new Date(data.timestamp);
        expiration.setMinutes(expiration.getMinutes() + sessionExpiryMins);
        // Remove from session of older than 10 minutes
        if (now.getTime() > expiration.getTime()) {
            data = false;
            sessionStorage.removeItem(key);
        }
    }
    if (!data) {
        var winLoss = await $.ajax({
            url: 'https://api.opendota.com/api/players/' + steamId + '/wl',
            method: 'GET',
            dataType: 'json'
        });
        data = {
            timestamp: new Date(),
            winLoss: winLoss
        }
        sessionStorage.setItem(generateKey(winLossKey), JSON.stringify(data))
    }
    return data.winLoss;
}

/* 
 * Helpers
 */

 function generateKey(keyPrefix) {
    return keyPrefix + "-" + getCogntioUsername()
 }