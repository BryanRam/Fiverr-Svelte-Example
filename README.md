# Fiverr App

This is an example of the kind of projects I build for clients on Fiverr, with the frontend built in Svelte and the backend built in Express. The Backend server makes API requests to get our sql queries from the database, which are then manipulated and displayed on the frontend.

## Get Started

First, make sure your database is running, whether locally or otherwise. Do this by importing ```sampledata.sql``` to a server and database of your choice. 

Then install dependencies for the backend server:

```bash
cd backend
npm install
```
... then start the server:

```bash
npm start
```

With the backend server running, you can make API Requests for data in your database. The URL for this is generally *http://localhost:3002*, but it can differ. So be sure to pay attention to the logs in the terminal.

Then for the frontend server, follow the instructions in the Readme in the frontend folder.

## Connection Settings

Navigate to ``` ./backend/queries.js ``` or ``` ./backend/postgres_queries.js ``` to edit your connection details to your database. Then you can navigate to ``` ./backend/index.js ``` to edit which type of connection you will use. 

On the frontend, navigate to the apiURL variable in ``` ./frontend/App.svelte ``` to edit the URL that you get API requests from. If running this locally, this URL should be the one you get from the backend (shown in the "IC backend API listening at X" message, where X is your API URL).

## Live Demo

A live demo of the site in action using a PostGres database instead of MySQL can be found at https://imaginechris-fiverr.onrender.com/.

The backend API server can also be found at https://imaginechris-fiverr-backend.onrender.com/ and uses the following endpoints (which are also used in this project):

- Get first 20 records: **/firstrecords**
- Get a page of records: **/page/:page**
- Get a searched list of records: **/search/:term/:page**
- Get total number of records: **/total**
- Get total number of records that match search: **/searchtotal/:term**

e.g Navigating to https://imaginechris-fiverr-backend.onrender.com/firstrecords will display a json list of 20 records.

e.g 2 Navigating to https://imaginechris-fiverr-backend.onrender.com/search/71/2 will display the second page of 20 records that have "71" in their Item column, in a json list. 
