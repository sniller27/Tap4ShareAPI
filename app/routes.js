var path = require('path');
var sanitizer = require('sanitizer');

//for image upload
var formidable = require('formidable');
var util = require('util');

//for moving files (images from temp to images folder)
var mv = require('mv');

var ImageSchema = require('./ImageSchema');

//for timestamps
var moment = require('moment-timezone');

module.exports = function (app) {

  //READ ALL IMAGES (GET)
  app.get('/api/images', function(req, res){

  var nameparameter = req.query.name;
  var nameparametersanitized = sanitizer.escape(nameparameter);

    ImageSchema.find({}, function(err, users) {
      if (err) throw err;

      res.json(users);
    });

  });

  //READ SPECIFIC IMAGE (GET)
  app.get('/api/images/:id', function(req, res){

  var imageid = req.params.id;
  var imageidsanitized = sanitizer.escape(imageid);

    ImageSchema.find({'imageid' : imageidsanitized}, function(err, users) {
      if (err) throw err;

      res.json(users);
    });

  });

  //READ SORTED NEWEST ADDED IMAGES BASED BY NUMBER (GET)
  app.get('/api/newimages/:qty', function(req, res){

    var qty = req.params.qty;
    var qtysanitized = sanitizer.escape(qty);
    qtysanitized = parseInt(qtysanitized)

    ImageSchema.find({}, function(err, users) {
      if (err) throw err;

      res.json(users);
    }).sort({_id: -1}).limit(qtysanitized);

  });

  //READ ONE RANDOM IMAGE (GET)
  app.get('/api/randomimagedata', function(req, res){

    ImageSchema.count().exec(function (err, count) {
      // Get a random entry
      var random = Math.floor(Math.random() * count)

      ImageSchema.findOne().skip(random).exec(
        function (err, result) {
          res.json(result);
        })
    })

  });

  app.get('/api/imagefile/:uploadname', function(req,res){
    var nameparameter = req.params.uploadname;
    var nameparametersanitized = sanitizer.escape(nameparameter);
    res.sendFile(path.join(__dirname, '../public/assets/images/', nameparametersanitized));
  });

  //INSERT NEW IMAGE (POST)
  app.post('/api/image', function(req, res){
    //moment.js timezome timestamp
    var timestamp = moment().tz("Europe/Zurich").format('YYYY-MM-DD H:mm:ss');
    var imagesource = req.body.source;
    var title = req.body.title;
    var description = req.body.description;
    var location = req.body.location;

    var newImageSchema = new ImageSchema({
      timestamp: timestamp,
      source: imagesource,
      title: title,
      description: description,
      location: location
    });

    //Mongoose Save Function to save data
    newImageSchema.save(function(error, product, numAffected) {
      if (error) {
        console.error(error);
      }
      if (numAffected == 1) {
        mv(path.join(__dirname, '../public/assets/temp/', imagesource), path.join(__dirname, '../public/assets/images/', imagesource), function(err) {
        });
      }
    });

    res.send(req.body);
  });

  //UPLOAD IMAGE
  app.post('/api/uploadfile', function(req, res){
    var form = new formidable.IncomingForm();
    form.uploadDir = "public/assets/temp/";
 
    form.parse(req, function(err, fields, files) {     
      //returns image name to client
      var filename = path.basename(files.file.path);
      res.json(filename);
    });
  });

  /** 

      UNUSED METHODS

  **/

  //UPDATE IMAGE (PUT)
  app.put('/api/image/:imageid', function(req, res){

    
    var imageid = req.param.imageid;

    ImageSchema.update({'imageid': imageid}, {
        favoritebool: req.body.afavorite
    }, function(err, numberAffected, rawResponse) {

    })

    res.send(req.body);

  });

  //DELETE IMAGE
  app.delete('/api/image/:imageid', function(req, res){

    var delid = req.param.imageid;

     //Mongoose Save Funtktion to save data
    ImageSchema.findOneAndRemove({imageid : delid}, function(error) {
      if (error) {
        console.error(error);
      }
    });

    res.send(req.body);
    
  });

};
