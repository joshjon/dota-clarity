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


    /*
     * Cognito User Pool functions
     */

    function register(email, password, onSuccess, onFailure) {
        var dataEmail = {
            Name: 'email',
            Value: email
        };
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

        userPool.signUp(email, password, [attributeEmail], null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
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
            document.getElementById("errorMessage").innerHTML = "Password length must be greater than or equal to 6" +
                "<br>Password must contain an uppercase letter" +
                "<br>Password must contain a lowercase letter" +
                "<br>Password must contain a number";
        };
        event.preventDefault();

        if (password === password2) {
            register(email, password, onSuccess, onFailure);
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
