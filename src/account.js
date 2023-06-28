import { renderContent } from ".";
import { NUM } from ".";


// BUG! callback sucks

// client side walls
// a function which validates the username string if it is valid
function usernameStringValidityWall(username) {
    // has letter
    let hasLetter = false;

    // check if length is valid
    if (username.length <= NUM.MAX_USERNAME_LENGTH && username.length >= NUM.MIN_USERNAME_LENGTH) {
        // loop through characters
        for (let i = 0; i < username.length; i++) {
            // the char code of the character
            let char = username.charCodeAt(i);

            // 0 to 9
            if (char >= 48 && char <= 57) {
                continue;
            }

            // A to Z
            else if (char >= 65 && char <= 90) {
                hasLetter = true;
                continue;
            }

            // a to z
            else if (char >= 97 && char <= 122) {
                hasLetter = true;
                continue;
            }

            // - | . | _
            else if (char === 45 || char === 46 || char === 95) {
                continue;
            }

            // character is invalid
            else {
                return false;
            }
        }
    }

    // length not valid
    else {
        return false;
    }

    // check if there has been a letter found
    if (hasLetter === true) {
        return true;
    }
    
    // if there is none
    else {
        return false;
    }
}

// a function which validates the password string if it is valid
function passwordStringValidityWall(password) {
    // check if length is valid
    if (password.length <= NUM.MAX_PASSWORD_LENGTH && password.length >= NUM.MIN_PASSWORD_LENGTH) {
        // loop through characters
        for (let i = 0; i < password.length; i++) {
            // the char code of the character
            let char = password.charCodeAt(i);

            // 0 to 9, A to Z, a to z, symbols and space
            if (char >= 32 && char <= 126) {
                continue;
            }

            // character is invalid
            else {
                return false;
            }
        }
    }

    // length not valid
    else {
        return false;
    }

    // string is valid
    return true;
}






// useful functions for "debugging"
// just a function which "logs" a message
function logger(message) {
    // for now
    alert(message);
}

// a wall to prevent an error from continuing
function clientErrorWall(bool, message = "ERROR!") {
    // if bool (probably a condition) is true
    if (bool === true) {
        // log the message
        logger(message);

        // return true
        return true;
    }

    // else
    else {
        // return false
        return false;
    }
}






// a function which returns an object that is used for fetching
function getFetchBody(isGiven = false, givenObject) {
    // if there is no given object
    if (isGiven === false) {
        // get credentials
        let credentials = getCredentials();

        // if get credentials returns error
        if (credentials === NUM.FAILED) {
            return NUM.FAILED;
        }

        // return this, with the body being the credentials
        return {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        };
    }

    // if there is a given object
    else if (isGiven === true) {
        // return this, with the body being the given object
        return {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(givenObject)
        }
    }
}

// redirects to a page
export function redirect(path) {
    window.location.pathname = path;
}

// save credentials to localStorage
function saveCredentials(username, password) {
    // to json format
    let json = JSON.stringify({
        username: username,
        password: password
    });

    // save to localStorage
    localStorage.setItem('credentials', json);
}

// get credentials, and if none, act accordingly (lol)
function getCredentials() {
    // get the credentials from localStorage
    let raw_credentials = localStorage.getItem('credentials');

    // if they are not present, return error
    if (raw_credentials === null) {
        return NUM.FAILED;
    }

    // the actual credentials, in JSON form
    let credentials;

    try {
        // try to parse the raw credentials
        credentials = JSON.parse(raw_credentials);
    }

    catch {
        // if error, then return error
        return NUM.FAILED;
    }

    // if username or password is not "there", send error
    if (clientErrorWall(!credentials.username || !credentials.password, "ERROR")) { return NUM.FAILED; }

    // check username string if it is valid
    if (clientErrorWall(!usernameStringValidityWall(credentials.username), "ERROR")) { return NUM.FAILED; }
    // check password string if it is valid
    if (clientErrorWall(!passwordStringValidityWall(credentials.password), "ERROR")) { return NUM.FAILED; }

    // finally, return the credentials
    return credentials;
}





// asks the server to validate the credentials
export function serverValidateCredentials(callbackTrue = ()=>{}, callbackFalse = ()=>{}) {
    // get the credentials
    let credentials = getCredentials();

    // check if credentials are good
    if (credentials === NUM.FAILED) {
        return;
    }

    // login, or in other words, ask the server for help to validate the credentials
    login(credentials.username, credentials.password, res => {console.log(1);
        // login failed- i mean server disagrees
        if (!isAPIRequestSuccessful(res)) {
            callbackFalse();
        }

        // else
        else {
            callbackTrue();
        }
    });
}




// a function that returns true if request response is successful
function isAPIRequestSuccessful(res) {
    // 1 indicates success
    if (res.status === NUM.SUCCESS) {
        // success
        return true;
    }

    // else 
    else {
        // failed
        return false;
    }
}



// login function
function login(username, password, callback = ()=>{}) {
    // check username string if it is valid
    if (clientErrorWall(!usernameStringValidityWall(username), "ERROR")) { return; }
    // check password string if it is valid
    if (clientErrorWall(!passwordStringValidityWall(password), "ERROR")) { return; }

    // get the fetch body
    let fetchBody = getFetchBody(true, {username: username, password: password});

    // if fetch body fails
    if (clientErrorWall(fetchBody === NUM.FAILED, "ERROR")) { return; } 

    // fetch /api/login, with the necessary information
    fetch("/api/login", fetchBody)
    // then convert response to json
    .then(response => response.json())

    .then(response => {
        // if unsuccessful, return
        if (clientErrorWall(!isAPIRequestSuccessful(response), "ERROR")) { return; }

        // callback with the response
        callback(response);
    });
}

// signup function
function signup(username, password, callback = ()=>{}) {
    // check username string if it is valid
    if (clientErrorWall(!usernameStringValidityWall(username), "ERROR")) { return; }
    // check password string if it is valid
    if (clientErrorWall(!passwordStringValidityWall(password), "ERROR")) { return; }

    // get the fetch body
    let fetchBody = getFetchBody(true, {username: username, password: password});

    // if fetch body fails
    if (clientErrorWall(fetchBody === NUM.FAILED, "ERROR")) { return; } 

    // fetch /api/createuser, with the necessary information
    fetch("/api/createuser", fetchBody)
    // then convert response to json
    .then(response => response.json())

    .then(response => {
        // if unsuccessful, return
        if (clientErrorWall(!isAPIRequestSuccessful(response), "ERROR")) { return; }

        // callback with the response
        callback(response);
    });
}

// get posts function
export const getPosts = function() {

    // get the fetch body
    let fetchBody = getFetchBody(false);

    // if fetch body fails
    if (clientErrorWall(fetchBody === NUM.FAILED, "ERROR")) { return; }

    // fetch /api/login, with the necessary information
    fetch("/api/getposts", fetchBody)
    // then convert response to json
    .then(response => response.json())
    // render the content
    .then(response => {
        // if unsuccessful, return
        if (clientErrorWall(!isAPIRequestSuccessful(response), "ERROR")) { return; }

        // callback with the response
        renderContent(response.data);
    });
}








// function is called when login form is submitted
function loginHandler(e, username, password) {
    // no to reload!!
    e.preventDefault();
    
    // try to login
    login(username, password, res => {
        // save credentials
        saveCredentials(username, password);

        // redirect to main page
        redirect("/");
    });
}

// function is called when signup form is submitted
function signupHandler(e, username, password) {
    // no to reload!!
    e.preventDefault();

    // try to login
    signup(username, password, res => {
        // save credentials
        saveCredentials(username, password);

        // redirect to main page
        redirect("/");
    });
}

// login component
export const LoginForm = function() {

    // username and password variables
    let username = "";
    let password = "";
    
    // the components encompassing the login component
    return (
        <>
        <h1>Login</h1>
        <form onSubmit={e => loginHandler(e, username, password)}>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" autoComplete="on" onChange={e => username = e.target.value}></input>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" autoComplete="on" onChange={e => password = e.target.value}></input>
            <input type="submit" value="Submit"></input>
        </form>
        </>
    );
}

export const SignupForm = function() {

    // username and password variables
    let username = "";
    let password = "";
    
    // the components encompassing the login component
    return (
        <>
        <h1>Signup</h1>
        <form onSubmit={e => signupHandler(e, username, password)}>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" autoComplete="on" onChange={e => username = e.target.value}></input>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" autoComplete="on" onChange={e => password = e.target.value}></input>
            <input type="submit" value="Submit"></input>
        </form>
        </>
    );
}