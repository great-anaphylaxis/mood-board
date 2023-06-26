

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

// function is called when form is submitted
function loginOnSubmit(e, username, password) {
    // no to reload!!
    e.preventDefault();
    
    // try to login
    login(username, password).then(e => {
        console.log(e);
    });
}

// login function
async function login(username, password) {
    // fetch /api/login, with the necessary information
    const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    // return the response, as json
    return response.json();
}