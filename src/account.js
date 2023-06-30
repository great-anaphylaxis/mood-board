import { useState } from "react";
import { ERROR_MESSAGE, NUM } from ".";


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

// a function which validates the post title string if it is valid
function postTitleStringValidityWall(title) {
    // check if title length is good
    if (title.length <= NUM.MAX_POSTTITLE_LENGTH && title.length >= NUM.MIN_POSTTITLE_LENGTH) {
        return true;
    }

    // else
    else {
        return false;
    } 
}

// a function which validates the post content string if it is valid
function postContentStringValidityWall(content) {
    // check if content length is good
    if (content.length <= NUM.MAX_POSTCONTENT_LENGTH && content.length >= NUM.MIN_POSTCONTENT_LENGTH) {
        return true;
    }

    // else
    else {
        return false;
    } 
}






// useful functions for "debugging"
// just a function which "logs" a message
function logger(message) {
    // for now
    alert(message);
}

// a wall to prevent an error from continuing
function clientErrorWall(callback, bool, message = ERROR_MESSAGE.UNKNOWN) {
    // if bool (probably a condition) is true
    if (bool === true) {
        // "callback" the message
        callback({
            status: NUM.FAILED,
            message: message
        });

        // also, yeah
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
    if (!credentials.username || !credentials.password) { return NUM.FAILED; }

    // check username string if it is valid
    if (!usernameStringValidityWall(credentials.username)) { return NUM.FAILED; }
    // check password string if it is valid
    if (!passwordStringValidityWall(credentials.password)) { return NUM.FAILED; }

    // finally, return the credentials
    return credentials;
}

// remove credentials hgehehehehehhe
function removeCredentials() {
    localStorage.removeItem("credentials");
}

// a function that returns true if request response is successful
export function isAPIRequestSuccessful(res) {
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





// the goood functions- i mean "essential"
// functions the require to have a callback lol
// aaaaaaa abstraction

// asks the server to validate the credentials
export function serverValidateCredentials(callback = ()=>{}) {
    // get the credentials
    let credentials = getCredentials();

    // check if credentials are good
    if (clientErrorWall(callback, credentials === NUM.FAILED, ERROR_MESSAGE.INVALID_CREDENTIALS)) { return; }

    // login, or in other words, ask the server for help to validate the credentials
    login(credentials.username, credentials.password, res => {
        callback(res);
    });
}

// login function
function login(username, password, callback = ()=>{}) {
    // check username string if it is valid
    if (clientErrorWall(callback, !usernameStringValidityWall(username), ERROR_MESSAGE.INVALID_USERNAME)) { return; }
    // check password string if it is valid
    if (clientErrorWall(callback, !passwordStringValidityWall(password), ERROR_MESSAGE.INVALID_PASSWORD)) { return; }

    // get the fetch body
    let fetchBody = getFetchBody(true, {username: username, password: password});




    // fetch /api/login, with the necessary information
    fetch("/api/login", fetchBody)
    // then convert response to json
    .then(response => response.json())

    .then(response => {
        // if unsuccessful, return
        if (clientErrorWall(callback, !isAPIRequestSuccessful(response), ERROR_MESSAGE.LOGIN_FAILED + ": " + response.message)) { return; }

        // callback with the response
        callback(response);
    })

    // no intenet bruh, or I guess server is down
    .catch(() => clientErrorWall(callback, true, ERROR_MESSAGE.FETCHING_FAILED));
}

// signup function
function signup(username, password, callback = ()=>{}) {
    // check username string if it is valid
    if (clientErrorWall(callback, !usernameStringValidityWall(username), ERROR_MESSAGE.INVALID_USERNAME)) { return; }
    // check password string if it is valid
    if (clientErrorWall(callback, !passwordStringValidityWall(password), ERROR_MESSAGE.INVALID_PASSWORD)) { return; }

    // get the fetch body
    let fetchBody = getFetchBody(true, {username: username, password: password});
    



    // fetch /api/createuser, with the necessary information
    fetch("/api/createuser", fetchBody)
    // then convert response to json
    .then(response => response.json())

    .then(response => {
        // if unsuccessful, return
        if (clientErrorWall(callback, !isAPIRequestSuccessful(response), ERROR_MESSAGE.SIGNUP_FAILED + ": " + response.message)) { return; }

        // callback with the response
        callback(response);
    })

    // no intenet bruh, or I guess server is down
    .catch(() => clientErrorWall(callback, true, ERROR_MESSAGE.FETCHING_FAILED));
}

// get posts function
export function getPosts(callback = ()=>{}) {

    // get the fetch body
    let fetchBody = getFetchBody(false);

    // if fetch body fails
    if (clientErrorWall(callback, fetchBody === NUM.FAILED, ERROR_MESSAGE.INVALID_CREDENTIALS)) { return; }



    // fetch /api/login, with the necessary information
    fetch("/api/getposts", fetchBody)
    // then convert response to json
    .then(response => response.json())
    // render the content
    .then(response => {
        // if unsuccessful, return
        if (clientErrorWall(callback, !isAPIRequestSuccessful(response), ERROR_MESSAGE.GETPOSTS_FAILED + ": " + response.message)) { return; }

        // callback with the response
        callback(response.data);
    })

    // no intenet bruh, or I guess server is down
    .catch(() => clientErrorWall(callback, true, ERROR_MESSAGE.FETCHING_FAILED));
}

// create a new post
export function createPost(title, content, callback = ()=>{}) {
    // check post title string if it is valid
    if (clientErrorWall(callback, !postTitleStringValidityWall(title), ERROR_MESSAGE.INVALID_POSTTITLE)) { return; }
    // check post content string if it is valid
    if (clientErrorWall(callback, !postContentStringValidityWall(content), ERROR_MESSAGE.INVALID_POSTCONTENT)) { return; }
    
    // get the fetch body
    let fetchBody = getFetchBody(false);

    // if fetch body fails
    if (clientErrorWall(callback, fetchBody === NUM.FAILED, ERROR_MESSAGE.INVALID_CREDENTIALS)) { return; }

    // edit fetchBody's body, to add the title and content
    fetchBody.body = JSON.parse(fetchBody.body);

    // add this to fetchBody's body
    fetchBody.body.post = {
        title: title,
        content: content
    }

    // then stringify fetchBody's body
    fetchBody.body = JSON.stringify(fetchBody.body);

    // is fetchBody a living thing?

    // fetchhhhhh
    fetch("/api/createpost", fetchBody)
    // then convert response to json
    .then(response => response.json())

    .then(response => {
        // if unsuccessful, return
        if (clientErrorWall(callback, !isAPIRequestSuccessful(response), ERROR_MESSAGE.CREATEPOST_FAILED + ": " + response.message)) { return; }

        // callback with the response
        callback(response);
    })

    // no intenet bruh, or I guess server is down
    .catch(() => clientErrorWall(callback, true, ERROR_MESSAGE.FETCHING_FAILED));
}

// haha no callback

// logout haha
export function logout() {
    // remove credentials
    removeCredentials();

    // redirect
    redirect('/login');
}








// function is called when login form is submitted
function loginHandler(e, username, password) {
    // no to reload!!
    e.preventDefault();
    
    // try to login
    login(username, password, res => {
        // check if response is bad
        if (res.status && res.status === NUM.FAILED) {
            return;
        }

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
        // check if response is bad
        if (res.status && res.status === NUM.FAILED) {
            return;
        }

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

    // state if password is shown
    let [showPassword, setShowPassword] = useState("password");
    
    // the components encompassing the login component
    return (
        <>
        <form onSubmit={e => loginHandler(e, username, password)} className="form">
            <h1 className="formtitle">Login</h1>


            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" autoComplete="on" onChange={e => username = e.target.value}></input>
            <label htmlFor="password">Password</label>
            <input type={showPassword} name="password" id="password" autoComplete="on" onChange={e => password = e.target.value}></input>




            <div className="formtool">
                <label htmlFor="showPassword">Show Password</label>
                <input type="checkbox" id="showPassword" name="showPassword" value="showPassword" onChange={e => {
                    if (e.target.checked === true) { // if checkbox is checked
                        setShowPassword("text"); // show password
                    }
                    else if (e.target.checked === false) { // else
                        setShowPassword("password"); // hide password
                    }
                }}></input>
                <p className="forgotpassword" onClick={e => {
                    e.preventDefault();

                    alert("Relax... and try to remember it");
                }}>Forgot Password?</p>
            </div>



            <input type="submit" value="Submit" id="submit"></input>

            <a className="formhint" href="/signup">Don't have an account yet?</a>
        </form>
        </>
    );
}

export const SignupForm = function() {

    // username and password variables
    let username = "";
    let password = "";

    // state if password is shown
    let [showPassword, setShowPassword] = useState("password");
    
    // the components encompassing the login component
    return (
        <>
            
            <form onSubmit={e => signupHandler(e, username, password)} className="form">
                <h1 className="formtitle">Signup</h1>

                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" autoComplete="on" onChange={e => username = e.target.value}></input>
                <label htmlFor="password">Password</label>
                <input type={showPassword} name="password" id="password" autoComplete="on" onChange={e => password = e.target.value}></input>



                <div className="formtool">
                    <label htmlFor="showPassword">Show Password</label>
                    <input type="checkbox" id="showPassword" name="showPassword" value="showPassword" onChange={e => {
                        if (e.target.checked === true) { // if checkbox is checked
                            setShowPassword("text"); // show password
                        }
                        else if (e.target.checked === false) { // else
                            setShowPassword("password"); // hide password
                        }
                    }}></input>
                </div>


                <input type="submit" value="Submit" id="submit"></input>

                <a className="formhint" href="/login">Already have an account?</a>
            </form>
        </>
    );
}