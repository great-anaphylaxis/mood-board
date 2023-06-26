



// a function that returns true if request response is successful
function isAccountRequestSuccessful(res) {
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
        if (isAccountRequestSuccessful(response) === true) {
            console.log(response.message);
        }

        // if not so successful response :(
        else {
            console.error("ERROR! " + response.message);
        }
    });
}










// function is called when form is submitted
function loginOnSubmit(e, username, password) {
    // no to reload!!
    e.preventDefault();
    
    // try to login
    login(username, password);
}


// login component
export const LoginForm = function() {

    // username and password variables
    let username = "";
    let password = "";
    
    // the components encompassing the login component
    return (
        <form onSubmit={e => loginOnSubmit(e, username, password)}>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" autoComplete="on" onChange={e => username = e.target.value}></input>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" autoComplete="on" onChange={e => password = e.target.value}></input>
            <input type="submit" value="Submit"></input>
        </form>
    );
}