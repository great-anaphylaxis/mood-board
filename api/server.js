
//scratch pad for bugs

// sanitize input, like length, special characters, etc...

//end


// le modules, or packages, or idk
// express
const express = require('express');
// node-postgres
const pg = require('pg');
// bcrypt
const bcrypt = require('bcrypt');
const { json } = require('express');





// le essentiales variables
// express server (or app)
const app = express();
// use this thing for json
app.use(express.json());
// the port
const port = 3001;

// the pool of database connections, or just the thing to connect to databases
const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'moodboardDB',
    password: 'admin',
    port: 5432
});






// all these functions are not really a "wall", made just to reduce my functions' "size"
// if the client messed up or tried to hack your app but instead did it incorrectly
function clientRequestErrorWall(res, bool, code = 400, message = "") {
    // if bool is true (a condition probably)
    if (bool == true) {
        // send the message, with a code, as a response to the request
        res.status(code).send(message);

        // return true
        return true;
    }

    // if not
    else {
        return false;
    }
}

// if the server messed up, probably because a cosmic ray hit one of the bits of the cpu, definitely not a bug.
function serverErrorWall(err, message = "Bro got an error!") {
    // if bool is true (a condition probably)
    if (err) {
        // log the error message
        console.error("\n\n" + message + "\n\n", err);

        // kill server ? is this actually necessary ???
        // after many hours of thought, this is probably not necessary
        // source: bro trust me
        //process.exit(-1);

        // return true
        return true;
    }

    // if not
    else {
        return false;
    }
}




// a function that queries the database, ez
function query(queryParam1, queryParam2 = undefined, callback = ()=>{}) {
    // attempt to connect the pool of database connections
    pool.connect((err, dbClient) => {
        // protek from error
        if (serverErrorWall(err)) { return; }

        // "execute" a query to database (I guess?)
        pool.query(queryParam1, queryParam2, (err, client) => {
            // protect the motherland
            serverErrorWall(err);

            // store the response in this constant
            const response = client.rows;

            // release the client connection (pool ?)
            dbClient.release();

            // then finally, return the response :D, in a callback
            callback(response);
        });
    });
}

// hash the plain password
function hashPassword(password, callback) {
    // yeah, hash it
    bcrypt.hash(password, 10, (err, hash) => {
        // error nope
        if (serverErrorWall(err)) { return; }

        // return to the callback function the hashed string
        callback(hash);
    });
}

// compare the plain text password and the hashed password, if they match
function comparePassword(attempt_password, hash_password, callback) {
    // (do i even need to comment the definition of this javascript statement?)
    bcrypt.compare(attempt_password, hash_password, (err, res) => {
        // if error, which is not gonna happen (pleaseee)
        if (serverErrorWall(err)) { return; }

        // i mean, you know what this means right?
        callback(res);
    });
}

// check if username exists in the database
function usernameExists(username, callback = ()=>{}) {
    // search the database for the username
    query("select * from public.users where username = $1", [username], res => {
        // if the response is empty
        if (!res[0]) {
            // the username does not exist, false
            callback(false);
        }

        // if there is a response
        else if (res[0].username == username) {
            // the username does exist, true
            callback(true);
        }
    });
}

// a function that returns a (specified) user in a JSON string
function userInJSON(username, password) {
    return JSON.stringify({
        username: username,
        password: password
    });
}

function checkUserInfoForValidity(res, username, password, callback = ()=>{}) {
    // get the username information from the database
    query("select * from public.users where username = $1", [username], DBRes => {
        // if username DOES NOT exist, then send error to client
        if (clientRequestErrorWall(res, !DBRes[0])) { return; }

        // get the username hashed password
        let hash_password = DBRes[0].password;

        // compare the passwords if they match
        comparePassword(password, hash_password, isValid => {
            callback(isValid);
        });
    });
}








// error when connecting to pool
pool.on('error', (err, client) => {
    // yeah, error if error
    if (serverErrorWall(err)) { return; }
});


// when /api is requested
app.get('/api', (req, res) => {
    // send this thing
    res.status(200).send("Here is what the server returns");
});

// when /api/createuser is called
// create user
// needs user info
app.post('/api/createuser', (req, res) => {
    // if the body is empty, then send error
    if (clientRequestErrorWall(res, !req.body)) { return; }

    // the username from the request
    let username = req.body.username;
    // the password from the request, and it is not hashed!
    let raw_password = req.body.password;

    // if username or password is empty, then send error
    if (clientRequestErrorWall(res, !username || !raw_password, 400)) { return; }

    // check if username exists
    query("select * from public.users where username = $1", [username], DBRes => {
        // if username exists, then send error to client
        // BUG
        if (clientRequestErrorWall(res, (DBRes[0] != undefined))) { return; }

        // if not...
        // hash the unsafe password
        hashPassword(raw_password, (password) => {
            // add the user
            query("insert into public.users(username, password) values($1, $2)", [username, password]);

            // send user as response, to indicate successful request
            res.status(201).send(userInJSON(username, raw_password));
        });
    });
});

// when /api/login is called
// check if correct, then log in
// needs user info
app.post('/api/login', (req, res) => {
    // if the body is empty, then send error
    if (clientRequestErrorWall(res, !req.body)) { return; }

    // the username from the request
    let username = req.body.username;
    // the password from the request
    let password = req.body.password;
    
    // if username or password is empty, then send error
    if (clientRequestErrorWall(res, !username || !password, 400)) { return; }

    // check if username and password are correct and valid
    checkUserInfoForValidity(res, username, password, isValid => {
        // if the passwords do match
        if (isValid == true) {
            // send ok, and the user
            res.status(200).send(userInJSON(username, password));
        }

        // else if they did not
        else if (isValid == false) {
            // send not ok
            res.status(403).send();
        }
    });
});

// when /api/getposts is called
// get posts from the database
app.get('/api/getposts', (req, res) => {
    // query ALL the posts, without any algorithm whatsoever
    query("select * from public.posts", undefined, DBRes => {
        // send ALL the posts :D
        res.status(200).send(JSON.stringify(DBRes));
    })
});

// when /api/createpost is called
// create a new post
// needs user info
app.post('/api/createpost', (req, res) => {
    // if the body is empty, then send error
    if (clientRequestErrorWall(res, !req.body)) { return; }

    // the username from the request
    let username = req.body.username;
    // the password from the request
    let password = req.body.password;

    // if username or password is empty, then send error
    if (clientRequestErrorWall(res, !username || !password, 400)) { return; }

    

    // if the post object is empty, then send error
    if (clientRequestErrorWall(res, !req.body.post)) { return; }

    // the post title to be created
    let postTitle = req.body.post.title;
    // the post content to be created
    let postContent = req.body.post.content;

    // if post title or post content is empty, then send error
    if (clientRequestErrorWall(res, !postTitle || !postContent, 400)) { return; }

    

    // check if username and password are correct and valid
    // this is to prevent "malicious" posting of something
    checkUserInfoForValidity(res, username, password, isValid => {
        // if the passwords do match
        if (isValid == true) {
            
            // add the post in the database
            query("insert into public.posts(title, \"from\", date, content) values($1, $2, $3, $4)",
            [postTitle, username, new Date().toUTCString(), postContent], () => {
                // send user as response, to indicate successful request
                res.status(201).send(userInJSON(username, password));
            });
        }

        // else if they did not
        else if (isValid == false) {
            // send not ok
            res.status(403).send();
        }
    });
});







// start the server
app.listen(port, () => {
    // console message to make sure
    console.log("Currently listening to port " + port);
});

// test query
query("select * from public.users where id = 0", undefined, res => {
    console.log(res);
});

usernameExists("admin");