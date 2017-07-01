/** 
    MODULES
**/
//express for middleware(static files), POST/GET methods
var express = require('express')
var app = express()
//body parser for encoding and getting POST parameters (and maybe URL's)
var bodyParser = require('body-parser')
//path for static files (core module)
var path = require('path');
//http (core module)
var http = require('http');
//mongoose makes it easier to communicate with mongodb
var mongoose = require('mongoose');

//config class
var connectdb = require('./config/db.js');
//routes and API endpoints
var routes = require('./app/routes.js');

//connect to mongodb
connectdb();

/**
    USED MIDDLEWARE
**/
 
//static files
app.use('/public', express.static(path.join(__dirname, 'public')));

//body parser
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//Create and Start a server
//Must be at the and, first we create our handle functions and than we start the server
const PORT= process.env.PORT || 8080;
var server = http.createServer(app);
server.listen(PORT, function(){
  console.log("Server listening on: http://localhost:%s", PORT);
});
 
//pass app to routes module
routes(app);

