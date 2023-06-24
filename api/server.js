
// le modules, or packages, or idk
// express
const express = require('express');
// node-postgres
const pg = require('pg');

// express server (or app)
const app = express();
// the port
const port = 3001;

// the pool of database connections, or just the thing to connect to databases
const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testDB',
    password: 'admin',
    port: 5432
});





// a function that queries the database, ez
function query(queryParam1, queryParam2 = undefined, callback) {
    // attempt to connect the pool of database connections
    pool.connect((err, dbClient) => {
        // if error
        if (err) {
            // log the error
            console.error('Bro got an error', err);

            // kill server
            process.exit(-1);
        }
    
        // if bro is good
        else {
            // "execute" a query to database (I guess?)
            pool.query(queryParam1, queryParam2, (err, client) => {
                // if another error
                if (err) {
                    // log the error
                    console.error('Bro got an error', err);

                    // kill server
                    process.exit(-1);
                }
    
                // if bro has hot hand
                else {
                    // store the response in this constant
                    const response = client.rows;

                    // release the client connection (pool ?)
                    dbClient.release();

                    // then finally, return the response :D, in a callback
                    callback(response);
                }
            });
        }
    });
}


// error when connecting to pool
pool.on('error', (err, client) => {
    // error message
    console.error('Bro got an error', err);

    // kill server ?
    process.exit(-1);
});

// when /api is requested
app.get('/api', (req, res) => {
    // send this thing
    res.send("Here is what the server returns");
});

// start the server
app.listen(port, () => {
    // console message to make sure
    console.log("Currently listening to port " + port);
});

query("select * from public.accounts", undefined, res => {
    console.log(res);
});