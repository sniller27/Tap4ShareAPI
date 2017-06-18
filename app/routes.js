var path = require('path');
var sanitizer = require('sanitizer');

var ImageSchema = require('./ImageSchema');

var clients = {};

module.exports = function (app) {

  //READ ALL IMAGES (GET)
  app.get('/api/images', function(req, res){
    console.log("first HERE GET");
  var nameparameter = req.query.name;
  var nameparametersanitized = sanitizer.escape(nameparameter);
    ImageSchema.find({'name' : new RegExp(nameparametersanitized, 'i')}, function(err, users) {
      if (err) throw err;

      res.json(users);
    });
  });

  //READ SPECIFIC IMAGE (GET)
  app.get('/api/image', function(req, res){
    console.log("first HERE GET");
  var nameparameter = req.query.name;
  // console.log(nameparameter);
  var nameparametersanitized = sanitizer.escape(nameparameter);
    ImageSchema.find({'name' : new RegExp(nameparametersanitized, 'i')}, function(err, users) {
      if (err) throw err;

      res.json(users);
    });
  });

  //INSERT NEW IMAGE (POST)
  app.post('/api/image', function(req, res){
console.log("first HERE POST");
    res.send(req.body);

    //sanitizing
    var sanitizename = sanitizer.escape(req.body.timestamp);
    var sanitizebplace = sanitizer.escape(req.body.source);

    var newImageSchema = new ImageSchema({
      timestamp: sanitizename,
      source: sanitizebplace,
      title: req.body.title,
      description: req.body.description
    });

    //Mongoose Save Function to save data
    newImageSchema.save(function(error, product, numAffected) {
      
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

  //UPDATE IMAGE (PUT)
  app.put('/api/image', function(req, res){

    res.send(req.body);
    var imageid = req.body.selectedid;

    ImageSchema.update({'id': imageid}, {
        favoritebool: req.body.afavorite
    }, function(err, numberAffected, rawResponse) {
       //handle it
       for(var i in clients){
           // Send a message to the client with the message
           clients[i].sendUTF("datasend");
       }
    })

  });

  //DELETE IMAGE
  app.delete('/api/image', function(req, res){

    res.send(req.body);
    var delid = req.body.selectedid;

     //Mongoose Save Funtktion to save data
    ImageSchema.findOneAndRemove({id : delid}, function(error) {
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
