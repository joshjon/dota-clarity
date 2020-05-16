/* 
 * Global var 
 */
var App = window.App || {};

checkUserAuth()

function signOut() {
    App.signOut();
    window.location = 'landing.html';
};

function getCurrentCognitoUser() {
    return App.getCurrentCognitoUser.username;
}

// TODO: Update this to get actual steam id
function getSteamId() {
    return 68726794;
}

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
            if (page == 'landing.html' || page == 'register.html' || page == "verify.html") {
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
