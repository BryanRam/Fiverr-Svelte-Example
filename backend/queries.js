const { request, response } = require('express')
const mysql = require('mysql');
const connection = mysql.createConnection({ //Connection details for mysql server. Edit these to provide your own
    host: 'localhost',
    user: '',
    password: '',
    database:''
});

connection.connect(function(err){
    if(err){
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

const sqlLimit = 20;

console.log("entry");

//Query for Getting the first 20 records in the database
const getFirstRecords = (request, response) => {
    console.log("First records");
    var sql = 'SELECT * FROM cci LIMIT ?';
    var inserts = [sqlLimit];
    sql = mysql.format(sql, inserts);

    //Run query and show error if there's a problem with the query
    connection.query(sql, (err, results) => {
        if(err)
        {
            console.log("There's an error");
            console.log(err);
            throw err;
        }
        
        response.status(200).json(results) //Convert results to json before returning data
    });

}

//Query for getting 20 records based on the offset provided in the database, with the offset usually being page number.
const getBatchRecords = (request, response) => {
    const page = parseInt(request.params.page);
    const offset = (page - 1) * sqlLimit;

    var sql = 'SELECT * FROM cci LIMIT ? OFFSET ?';
    var inserts = [sqlLimit, offset];
    sql = mysql.format(sql, inserts);

    connection.query(sql, (err, results) => {
        if(err) throw err

        response.status(200).json(results) //
    });

}

//Query for getting a record based on the search term. We're searching based on the item column
const getRecord = (request, response) => {
    const term = request.params.term.toString();
    const searchTerm = "%" + term + "%";
    const page = parseInt(request.params.page);
    const offset = (page - 1) * sqlLimit;

    //The query sets both the data in the Item column and the search term to uppercase to make the search case insensitive
    //Offset is based on page number * number of items per page
    var sql = `SELECT * FROM cci 
    WHERE UPPER(Item) LIKE UPPER(?) 
    LIMIT ? OFFSET ?`;
    
    var inserts = [searchTerm, sqlLimit, offset];
    sql = mysql.format(sql, inserts);

    connection.query(sql, (err, results) => {
        if(err) throw err

        response.status(200).json(results)
    });
    
}

//Get total number of records in the database
const getNumRecordsTotal = (request, response) => {

    var sql = 'SELECT COUNT(*) AS count FROM cci';

    connection.query(sql, (err, results) => {
        if(err) throw err

        response.status(200).json(results)
    });
    
}

//Get total number of records that satisfy the search term
const getNumRecordsSearch = (request, response) => {
    const term = request.params.term.toString();
    const searchTerm = "%" + term + "%";

    var sql = `SELECT COUNT(*) AS count FROM cci 
    WHERE UPPER(Item) LIKE UPPER(?)`;
    var inserts = [searchTerm];
    sql = mysql.format(sql, inserts);

    connection.query(sql, (err, results) => {
        if(err) throw err

        response.status(200).json(results)
    });
}

module.exports = {
    getFirstRecords,
    getBatchRecords,
    getRecord,
    getNumRecordsTotal,
    getNumRecordsSearch,
}