var mongoose = require('mongoose');

module.exports = function () { 

	var URLmongodb = 'mongodb://john:1234@ds137121.mlab.com:37121/artistdb';

	//Mongoose Connection
	mongoose.connect(URLmongodb); // connect to our mongoDB database (uncomment after you enter in your own credentials in config/db.js)

	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error"));

	db.once("open", function (callback) {
	  console.log("Connection succeeded.");
	});

};
