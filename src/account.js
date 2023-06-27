


// just a function which "logs" a message
function logger(message) {
    // for now
    console.log(message);
}

// redirects to a page
function redirect(path) {
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




// a function that returns true if request response is successful
function isAPIRequestSuccessful(res) {
    // 1 indicates success
    if (res.status === 1) {
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
function login(username, password) {
    // fetch /api/login, with the necessary information
    fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    // then convert response to json
    .then(response => response.json())

    .then(response => {
        // if successful response
        if (isAPIRequestSuccessful(response) === true) {
            // logger
            logger(response.message);

            // save credentials
            saveCredentials(username, password);

            // redirect to main page
            redirect("/");
        }

        // if not so successful response :(
        else {
            // logger
            logger("ERROR! " + response.message);
        }
    });
}

// signup function
function signup(username, password) {
    // fetch /api/createuser, with the necessary information
    fetch("/api/createuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    // then convert response to json
    .then(response => response.json())

    .then(response => {
        // if successful response
        if (isAPIRequestSuccessful(response) === true) {
            // logger
            logger(response.message);

            // save credentials
            saveCredentials(username, password);

            // redirect to main page
            redirect("/");
        }

        // if not so successful response :(
        else {
            // logger
            logger("ERROR! " + response.message);
        }
    });
}





// function is called when login form is submitted
function loginHandler(e, username, password) {
    // no to reload!!
    e.preventDefault();
    
    // try to login
    login(username, password);
}

// function is called when signup form is submitted
function signupHandler(e, username, password) {
    // no to reload!!
    e.preventDefault();

    // try to login
    signup(username, password);
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