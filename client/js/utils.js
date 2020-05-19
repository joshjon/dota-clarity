/* 
 * Global var 
 */
var App = window.App || {};

checkUserAuth()

function signOut() {
    App.signOut();
    window.localStorage.removeItem('dota-clarity-matches');
    window.location = 'landing.html';
};

function getCogntioUsername() {
    return App.getCurrentCognitoUser.username;
}

function getCognitoSteamId() {
    return new Promise(function (resolve) {
        App.authToken.then(function (token) {
            var decode = parseJwt(token)
            resolve(decode['custom:steamId'])
        })
    })
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

/* 
 * Checks if the a valid auth token exists and redirects accordingly.
 * You should not have to call this manually since it is invoked at the beginning of this file.
 */
function checkUserAuth() {
    App.authToken.then(function (token) {
        var path = window.location.pathname;
        var page = path.split("/").pop();
        if (token) {
            // The user should be directed to the home page if they are already logged in and have a valid auth token
            if (page == 'landing.html' || page == 'register.html' || page == "verify.html" || page == "login.html") {
                window.location.href = 'home.html';
            }
        } else if (!token) {
            // Having no token is only acceptable on the landing, register, and verify pages
            if (page != 'landing.html' && page != 'register.html' && page != "verify.html") {
                window.location.href = 'landing.html';
            }
        }
    }).catch(function () {
        window.location.href = '/landing.html';
    });
}
