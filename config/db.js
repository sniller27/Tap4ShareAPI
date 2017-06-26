var mongoose = require('mongoose');

module.exports = function () { 

	var env = process.env.NODE_ENV || 'dev';
	console.log(env);
	// var URLmongodb = 'mongodb://john:1234@ds131512.mlab.com:31512/tap4share';
	
	var URLmongodb = 'mongodb://localhost:27017/tap4share';

	//Mongoose Connection
	mongoose.connect(URLmongodb); // connect to our mongoDB database (uncomment after you enter in your own credentials in config/db.js)

	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error"));

	db.once("open", function (callback) {
	  console.log("Connection succeeded.");
	});

};
