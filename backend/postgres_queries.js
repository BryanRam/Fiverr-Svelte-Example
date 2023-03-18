//This is a postgresql version of queries.js, used for testing on render.com
//The main differences here are using PG Pool instead of MySQL Connection as the connection point
//And with Postgres, we use $ instead of ? as our way to insert variables into sql queries, e.g $1 $2
const { request, response } = require('express')

const sqlLimit = 20;

console.log("entry");

const Pool = require('pg').Pool

const pool = new Pool({ //Connection details for postgresql server. Edit these to provide your own
    user: '',
    host: '',
    database: '',
    password: '',
    port: '5432',
    ssl: true,
})

const getFirstRecords = (request, response) => {
    console.log("First records");
     

    pool.query('SELECT * FROM cci LIMIT $1', [sqlLimit], (error, results) => {
        if(error){
            throw error
        }

        response.status(200).json(results.rows)
    })
}

const getBatchRecords = (request, response) => {
    const page = parseInt(request.params.page);
    const offset = (page - 1) * sqlLimit;

  
    pool.query('SELECT * FROM cci LIMIT $2 OFFSET $1', [offset, sqlLimit], (error, results) => {
        if(error){
            throw error
        }

        response.status(200).json(results.rows)
    });
}

const getRecord = (request, response) => {
    const term = request.params.term.toString();
    const searchTerm = "%" + term + "%";
    const page = parseInt(request.params.page);
    const offset = (page - 1) * sqlLimit;

    console.log("searchTerm: " + searchTerm);

    pool.query(`SELECT * FROM cci 
                WHERE UPPER("Item") LIKE UPPER($1) 
                LIMIT $3 OFFSET $2`, [searchTerm, offset, sqlLimit], (error, results) => {
        if(error){
            throw error
        }

        response.status(200).json(results.rows)
    });
}

const getNumRecordsTotal = (request, response) => {
    
    pool.query('SELECT COUNT(*) FROM cci', (error, results) => {
        if(error){
            throw error
        }

        response.status(200).json(results.rows)
    });
}

const getNumRecordsSearch = (request, response) => {
    const term = request.params.term.toString();
    const searchTerm = "%" + term + "%";

    console.log("searchTerm2: " + searchTerm);
    
    pool.query(`SELECT COUNT(*) FROM cci 
                WHERE UPPER("Item") LIKE UPPER($1)`, 
                [searchTerm], (error, results) => 
        {
        if(error){
            throw error
        }

        response.status(200).json(results.rows)
    });
}

module.exports = {
    getFirstRecords,
    getBatchRecords,
    getRecord,
    getNumRecordsTotal,
    getNumRecordsSearch,
}