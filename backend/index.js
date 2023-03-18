const express = require('express');
const app = express(); //Run an Express Server for our API

const cors = require('cors');

const url = process.env.URL || "http://localhost";
const port = process.env.PORT || 3002;

const queries = require('./queries'); //API set up for MySQL queries. 
const postgresQueries = require('./postgres_queries'); //API set up for PostGres queries. 

let useMySqlConnection = true; //Set this to false if you want to use the PostGres connection

app.use(cors());

app.listen(port, () => {
  console.log(`IC Backend API listening at ${url}:${port}`)
});

//API Endpoints
if(useMySqlConnection)
{
  app.get('/firstrecords', queries.getFirstRecords); //get first 20 records
  app.get('/page/:page', queries.getBatchRecords); //get records at specific page
  app.get('/search/:term/:page', queries.getRecord); //search for records that match search term
  app.get('/searchtotal/:term', queries.getNumRecordsSearch); //get number of records that match search term
  app.get('/total/', queries.getNumRecordsTotal); //get number of records in the database
}
else
{
  app.get('/firstrecords', postgresQueries.getFirstRecords); //get first 20 records
  app.get('/page/:page', postgresQueries.getBatchRecords); //get records at specific page
  app.get('/search/:term/:page', postgresQueries.getRecord); //search for records that match search term
  app.get('/searchtotal/:term', postgresQueries.getNumRecordsSearch); //get number of records that match search term
  app.get('/total/', postgresQueries.getNumRecordsTotal); //get number of records in the database
}


