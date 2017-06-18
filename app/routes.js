var path = require('path');
var sanitizer = require('sanitizer');

var Artist = require('./Artist');

var count = 0;
var clients = {};

module.exports = function (app) {

  //READ ALL ARTISTS (GET)
  app.get('/api/artists', function(req, res){
    console.log("first HERE GET");
  var nameparameter = req.query.name;
  var nameparametersanitized = sanitizer.escape(nameparameter);
    Artist.find({'name' : new RegExp(nameparametersanitized, 'i')}, function(err, users) {
      if (err) throw err;

      res.json(users);
    });
  });

  //READ SPECIFIC ARTISTS (GET)
  app.get('/api/artist', function(req, res){
    console.log("first HERE GET");
  var nameparameter = req.query.name;
  // console.log(nameparameter);
  var nameparametersanitized = sanitizer.escape(nameparameter);
    Artist.find({'name' : new RegExp(nameparametersanitized, 'i')}, function(err, users) {
      if (err) throw err;

      res.json(users);
    });
  });

  //INSERT NEW ARTIST (POST)
  app.post('/api/artist', function(req, res){
console.log("first HERE POST");
    res.send(req.body);

    //sanitizing
    var sanitizename = sanitizer.escape(req.body.name);
    var sanitizebplace = sanitizer.escape(req.body.birthPlace);

    var newArtist = new Artist({
      name: sanitizename,
      birthPlace: sanitizebplace,
      birthDate: req.body.birthDate,
      favoritebool: req.body.favoritebool
    });

    //Mongoose Save Function to save data
    newArtist.save(function(error, product, numAffected) {
      
      if (error) {
        console.error(error);
      }
      if (numAffected == 1) {
        for(var i in clients){
            // Send a message to the client with the message
            clients[i].sendUTF("datasend");
        }
      }

    });

  });

  //UPDATE ARTIST (PUT)
  app.put('/api/artist', function(req, res){

    res.send(req.body);
    var artistid = req.body.selectedid;

    Artist.update({'id': artistid}, {
        favoritebool: req.body.afavorite
    }, function(err, numberAffected, rawResponse) {
       //handle it
       for(var i in clients){
           // Send a message to the client with the message
           clients[i].sendUTF("datasend");
       }
    })

  });

  //DELETE ARTIST
  app.delete('/api/artist', function(req, res){

    res.send(req.body);
    var delid = req.body.selectedid;

     //Mongoose Save Funtktion to save data
    Artist.findOneAndRemove({id : delid}, function(error) {
      if (error) {
        console.error(error);
      }
      for(var i in clients){
          // Send a message to the client with the message
          clients[i].sendUTF("datasend");
      }
    });
    
  });

};
