// le modules, or packages, or idk
// express
const express = require('express');
// node-postgres
const pg = require('pg');
// bcrypt
const bcrypt = require('bcrypt');





// le essentiales variables
// express server (or app)
const app = express();
// body parser (i mean, yeah)
const bodyParser = require('body-parser');

// avoid limit error- maybe ?
app.use(bodyParser.json({ limit: '50mb' }));

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



// numbers
const NUM = {
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 20,

    MIN_PASSWORD_LENGTH: 5,
    MAX_PASSWORD_LENGTH: 32,

    MIN_POSTTITLE_LENGTH: 3,
    MAX_POSTTITLE_LENGTH: 64,

    MIN_POSTCONTENT_LENGTH: 3,
    MAX_POSTCONTENT_LENGTH: 10000,

    FAILED: -1,
    SUCCESS: 1
};

// messages
// error messages
const ERROR_MESSAGE = {
    UNKNOWN: "Something unknown happened",

    USERNAME_DOES_NOT_EXIST: "Username does not exist",
    INVALID_USERNAME: "Invalid username, length not allowed or contains invalid characters",
    USERNAME_ALREADY_EXISTS: "Username already exists",

    INVALID_PASSWORD: "Invalid password, length not allowed or contains invalid characters",

    EMPTY_BODY: "Body is empty",
    INCOMPLETE_BODY: "Body is incomplete",
    
    LOGIN_FAILED: "Username and password do not match",

    NO_POST_INFORMATION: "No post information available",
    INCOMPLETE_POST: "Post information is incomplete",

    INVALID_POSTTITLE: "Invalid post title, length not allowed or contains invalid characters",
    INVALID_POSTCONTENT: "Invalid post content, length not allowed or contains invalid characters",

    INVALID_CREDENTIALS: "Invalid credentials, please log in again",
};

// success messages
const SUCCESS_MESSAGE = {
    DEFAULT: "Success",

    API_LANDING: "Welcome to moodboard's /api",

    USER_CREATED: "New user created",

    LOGIN_SUCCESS: "Login successful",

    POST_CREATED: "New post created",

    GETPOST_SUCCESS: "Got posts successfully",
};






// all these functions are not really a "wall", made just to reduce my functions' "size"
// if the client messed up or tried to hack your app but instead did it incorrectly
function clientRequestErrorWall(res, bool, code = 400, message = ERROR_MESSAGE.UNKNOWN) {
    // if bool is true (a condition probably)
    if (bool == true) {
        // send the message, with a code, as a response to the request
        res.status(code).send(responseReadyMessage(message, NUM.FAILED));

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

// like the clientRequestErrorWall, but the exact opposite
function clientRequestSuccessWall(res, code = 200, message = SUCCESS_MESSAGE.DEFAULT) {
    // respond to request
    res.status(code).send(responseReadyMessage(message, NUM.SUCCESS));
}

// a function that return a response to a request
// and.... that response is "translated" for the client
function responseReadyMessage(message, status) {
    // yeah, jsonify the stuff
    return JSON.stringify({
        status: status,
        message: message
    });
}


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
            else if (char == 45 || char == 46 || char == 95) {
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
    if (hasLetter == true) {
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

// a function which checks the integrity of the user
function checkUserInfoForValidity(res, username, password, callback = ()=>{}) {
    // get the username information from the database
    query("select * from public.users where username = $1", [username], DBRes => {
        // if username DOES NOT exist, then send error to client
        if (clientRequestErrorWall(res, !DBRes[0], 403, ERROR_MESSAGE.USERNAME_DOES_NOT_EXIST)) { return; }

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
    clientRequestSuccessWall(res, 200, SUCCESS_MESSAGE.API_LANDING);
});

// when /api/createuser is called
// create user
// needs user info
app.post('/api/createuser', (req, res) => {
    // if the body is empty, then send error
    if (clientRequestErrorWall(res, !req.body, 400, ERROR_MESSAGE.EMPTY_BODY)) { return; }

    // the username from the request
    let username = req.body.username;
    // the password from the request, and it is not hashed!
    let raw_password = req.body.password;

    // if username or password is empty, then send error
    if (clientRequestErrorWall(res, !username || !raw_password, 400, ERROR_MESSAGE.INCOMPLETE_BODY)) { return; }

    // check if username is valid
    if (clientRequestErrorWall(res, !usernameStringValidityWall(username), 400, ERROR_MESSAGE.INVALID_USERNAME)) { return; }
    // check if password is valid
    if (clientRequestErrorWall(res, !passwordStringValidityWall(raw_password), 400, ERROR_MESSAGE.INVALID_PASSWORD)) { return; }

    // check if username exists
    query("select * from public.users where username = $1", [username], DBRes => {
        // if username exists, then send error to client
        if (clientRequestErrorWall(res, (DBRes[0] != undefined), 400, ERROR_MESSAGE.USERNAME_ALREADY_EXISTS)) { return; }

        // if not...
        // hash the unsafe password
        hashPassword(raw_password, (password) => {
            // add the user
            query("insert into public.users(username, password) values($1, $2)", [username, password]);

            // send successful response
            clientRequestSuccessWall(res, 201, SUCCESS_MESSAGE.USER_CREATED);
        });
    });
});

// when /api/login is called
// check if correct, then log in
// needs user info
app.post('/api/login', (req, res) => {
    // if the body is empty, then send error
    if (clientRequestErrorWall(res, !req.body, 400, ERROR_MESSAGE.EMPTY_BODY)) { return; }

    // the username from the request
    let username = req.body.username;
    // the password from the request
    let password = req.body.password;
    
    // if username or password is empty, then send error
    if (clientRequestErrorWall(res, !username || !password, 400, ERROR_MESSAGE.INCOMPLETE_BODY)) { return; }

    // check if username is valid
    if (clientRequestErrorWall(res, !usernameStringValidityWall(username), 400, ERROR_MESSAGE.INVALID_USERNAME)) { return; }
    // check if password is valid
    if (clientRequestErrorWall(res, !passwordStringValidityWall(password), 400, ERROR_MESSAGE.INVALID_PASSWORD)) { return; }

    // check if username and password are correct and valid
    checkUserInfoForValidity(res, username, password, isValid => {
        // if the passwords do match
        if (isValid == true) {
            // send ok, and the user
            clientRequestSuccessWall(res, 200, SUCCESS_MESSAGE.LOGIN_SUCCESS);
        }

        // else if they did not
        else if (isValid == false) {
            // send not ok
            clientRequestErrorWall(res, true, 403, ERROR_MESSAGE.LOGIN_FAILED);
        }
    });
});

// when /api/getposts is called
// get posts from the database
// needs user info
app.post('/api/getposts', (req, res) => {
    // if the body is empty, then send error
    if (clientRequestErrorWall(res, !req.body, 400, ERROR_MESSAGE.EMPTY_BODY)) { return; }

    // the username from the request
    let username = req.body.username;
    // the password from the request
    let password = req.body.password;

    // if username or password is empty, then send error
    if (clientRequestErrorWall(res, !username || !password, 400, ERROR_MESSAGE.INCOMPLETE_BODY)) { return; }

    // check if username is valid
    if (clientRequestErrorWall(res, !usernameStringValidityWall(username), 400, ERROR_MESSAGE.INVALID_USERNAME)) { return; }
    // check if password is valid
    if (clientRequestErrorWall(res, !passwordStringValidityWall(password), 400, ERROR_MESSAGE.INVALID_PASSWORD)) { return; }


    // check if username and password are correct and valid
    // this is to prevent "malicious" posting of something
    checkUserInfoForValidity(res, username, password, isValid => {
        // if the passwords do match
        if (isValid == true) {
            
            // query ALL the posts, without any algorithm whatsoever
            query("select * from public.posts order by id desc", undefined, DBRes => {
                // send ALL the posts :D
                res.status(200).send(JSON.stringify({
                    status: 1,
                    message: SUCCESS_MESSAGE.GETPOST_SUCCESS,
                    data: DBRes
                }));
            });
        }

        // else if they did not
        else if (isValid == false) {
            // send not ok
            clientRequestErrorWall(res, true, 403, ERROR_MESSAGE.INVALID_CREDENTIALS);
        }
    });
});

// when /api/createpost is called
// create a new post
// needs user info
app.post('/api/createpost', (req, res) => {
    // if the body is empty, then send error
    if (clientRequestErrorWall(res, !req.body, 400, ERROR_MESSAGE.EMPTY_BODY)) { return; }

    // the username from the request
    let username = req.body.username;
    // the password from the request
    let password = req.body.password;

    // if username or password is empty, then send error
    if (clientRequestErrorWall(res, !username || !password, 400, ERROR_MESSAGE.INCOMPLETE_BODY)) { return; }

    // check if username is valid
    if (clientRequestErrorWall(res, !usernameStringValidityWall(username), 400, ERROR_MESSAGE.INVALID_USERNAME)) { return; }
    // check if password is valid
    if (clientRequestErrorWall(res, !passwordStringValidityWall(password), 400, ERROR_MESSAGE.INVALID_PASSWORD)) { return; }

    // if the post object is empty, then send error
    if (clientRequestErrorWall(res, !req.body.post, 400, ERROR_MESSAGE.NO_POST_INFORMATION)) { return; }

    // the post title to be created
    let postTitle = req.body.post.title;
    // the post content to be created
    let postContent = req.body.post.content;

    // if post title or post content is empty, then send error
    if (clientRequestErrorWall(res, !postTitle || !postContent, 400, ERROR_MESSAGE.INCOMPLETE_POST)) { return; }

    // check if post title is valid
    if (clientRequestErrorWall(res, !postTitleStringValidityWall(postTitle), 400, ERROR_MESSAGE.INVALID_POSTTITLE)) { return; }
    // check if post content is valid
    if (clientRequestErrorWall(res, !postContentStringValidityWall(postContent), 400, ERROR_MESSAGE.INVALID_POSTCONTENT)) { return; }

    // check if username and password are correct and valid
    // this is to prevent "malicious" posting of something
    checkUserInfoForValidity(res, username, password, isValid => {
        // if the passwords do match
        if (isValid == true) {
            
            // add the post in the database
            query("insert into public.posts(title, \"from\", date, content) values($1, $2, $3, $4)",
            [postTitle, username, new Date().toUTCString(), postContent], () => {
                // successful request
                clientRequestSuccessWall(res, 201, SUCCESS_MESSAGE.POST_CREATED);
            });
        }

        // else if they did not
        else if (isValid == false) {
            // send not ok
            clientRequestErrorWall(res, true, 403, ERROR_MESSAGE.INVALID_CREDENTIALS);
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