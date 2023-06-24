
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
    }

    // if not
    else {
        return;
    }
}

// if the server messed up, probably because a cosmic ray hit one of the bits of the cpu, definitely not a bug.
function serverErrorWall(err, message = "Bro got an error!") {
    // if bool is true (a condition probably)
    if (err) {
        // log the error message
        console.error("\n\n" + message + "\n\n", err);

        // kill server ? is this actually necessary ???
        process.exit(-1);
    }

    // if not
    else {
        return false;
    }
}



// a function that queries the database, ez
function query(queryParam1, queryParam2 = undefined, callback = () => {}) {
    // attempt to connect the pool of database connections
    pool.connect((err, dbClient) => {
        // protek from error
        serverErrorWall(err);

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
        serverErrorWall(err);

        // return to the callback function the hashed string
        callback(hash);
    });
}

// compare the plain text password and the hashed password, if they match
function comparePassword(attempt_password, hash_password, callback) {
    // (do i even need to comment the definition of this javascript statement?)
    bcrypt.compare(attempt_password, hash_password, (err, res) => {
        // if error, which is not gonna happen (pleaseee)
        serverErrorWall(err);

        // i mean, you know what this means right?
        callback(res);
    });
}








// error when connecting to pool
pool.on('error', (err, client) => {
    // yeah, error if error
    serverErrorWall(err);
});


// when /api is requested
app.get('/api', (req, res) => {
    // send this thing
    res.status(200).send("Here is what the server returns");
});

// when /api/createuser is called
// create user
app.post('/api/createuser', (req, res) => {
    // if the body is empty, then send error
    clientRequestErrorWall(res, !req.body, 400);

    // the username from the request
    let username = req.body.username;
    // the password from the request, and it is not hashed!
    let raw_password = req.body.password;

    // if username or password is empty, then send error
    clientRequestErrorWall(res, !username || !raw_password, 400);

    // hash the unsafe password
    hashPassword(raw_password, (password) => {
        // add the user
        query("insert into public.users(username, password) values($1, $2)", [username, password]);

        // send this response, to indicate successful request
        res.status(201).send("Finished!");
    });
});

// when /api/login is called
// check if correct, then log in
app.get('/api/login', (req, res) => {
    // if the body is empty, then send error
    clientRequestErrorWall(res, !req.body, 400);

    // the username from the request
    let username = req.body.username;
    // the password from the request
    let password = req.body.password;

    // if username or password is empty, then send error
    clientRequestErrorWall(res, !username || !password, 400);

    // get the username information from the database
    query("select * from public.users where username = $1", [username], DBRes => {
        // get the username hashed password
        let hash_password = DBRes[0].password;

        // compare the passwords if they match
        comparePassword(password, hash_password, isValid => {
            // if the passwords do match
            if (isValid == true) {
                // send ok
                res.status(200).send();
            }

            // else if they did not
            else if (isValid == false) {
                // send not ok
                res.status(403).send();
            }
        });
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