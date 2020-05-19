/* 
 * Global var 
 */
var App = window.App || {};

(function scopeWrapper($) {
    var signinUrl = 'login.html';

    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool;
    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config.cognito.region;
    }

    /*
     * Sign Out
     */
    App.signOut = function signOut() {
        userPool.getCurrentUser().signOut();
    };

    /*
     * Get current user
     */
    App.getCurrentCognitoUser = userPool.getCurrentUser();

    /*
     * Auth token
     */
    App.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            resolve(null);
        }
    });

    App.idToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken());
                }
            });
        } else {
            resolve(null);
        }
    });



    /*
     * Cognito User Pool functions
     */

    function register(email, password, steamId, onSuccess, onFailure) {
        var dataEmail = {
            Name: 'email',
            Value: email
        };
        console.log(steamId)
        var dataSteamId = {
            Name: 'custom:steamId',
            Value: steamId
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
        var attributeSteamId = new AmazonCognitoIdentity.CognitoUserAttribute(dataSteamId);

        userPool.signUp(email, password, [attributeEmail, attributeSteamId], null,
            function signUpCallback(err, result) {
                console.log(attributeSteamId)
                if (!err) {
                    onSuccess(result);
                } else {
                    console.log(err)
                    onFailure(err);
                }
            }
        );
    }

    function signin(email, password, onSuccess, onFailure) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password
        });

        var cognitoUser = createCognitoUser(email);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    }

    function verify(email, code, onSuccess, onFailure) {
        createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        });
    }

    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });
    }

    /*
     *  Event Handlers
     */

    $(function onDocReady() {
        // When the sign in form is submitted
        $('#signinForm').submit(handleSignin);
        // When the registration form is submitted
        $('#registrationForm').submit(handleRegister);
        // When the verify form is submitted
        $('#verifyForm').submit(handleVerify);
    });

    function handleSignin(event) {
        var email = $('#emailInputSignin').val();
        var password = $('#passwordInputSignin').val();
        event.preventDefault();

        // Checks if user is signed in and handles based on success or error
        signin(email, password, signinSuccess, signinError);

        function signinSuccess() {
            console.log('Successfully Logged In');
            window.location.href = 'home.html';
        }

        function signinError(err) {
            document.getElementById("errorMessage").innerHTML = "Incorrect username or password";
        }
    }

    function handleRegister(event) {
        var steamId = $('#steamIdInputRegister').val();
        var email = $('#emailInputRegister').val();
        var password = $('#passwordInputRegister').val();
        var password2 = $('#password2InputRegister').val();

        var onSuccess = function registerSuccess(result) {
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            var confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
            if (confirmation) {
                window.location.href = 'verify.html';
            }
        };
        var onFailure = function registerFailure(err) {
            document.getElementById("errorMessage").innerHTML = "Error occured, please ensure you meet the following criteria:" +
                "<br>Password must be at least 6 characters" +
                "<br>Must have a valid email" +
                "<br>Must have a valid 32 bit Steam ID";
        };
        event.preventDefault();

        if (password === password2) {
            register(email, password, steamId, onSuccess, onFailure);
        } else {
            document.getElementById("errorMessage").innerHTML = "Passwords do not match";
        }
    }

    function handleVerify(event) {
        console.log("here");
        var email = $('#emailInputVerify').val();
        var code = $('#codeInputVerify').val();
        event.preventDefault();
        verify(email, code,
            function verifySuccess(result) {
                console.log('call result: ' + result);
                console.log('Successfully verified');
                window.location.href = signinUrl;
            },
            function verifyError(err) {
                document.getElementById("errorMessage").innerHTML = "Incorrect email or verification code";
            }
        );
    }
}(jQuery));
