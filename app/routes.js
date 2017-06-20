var path = require('path');
var sanitizer = require('sanitizer');

//for image upload
var formidable = require('formidable');
var util = require('util');

//for moving files (images from temp to images folder)
var mv = require('mv');

var ImageSchema = require('./ImageSchema');

var clients = {};

module.exports = function (app) {

  //READ ALL IMAGES (GET)
  app.get('/api/images', function(req, res){
    console.log("first HERE GET");
  var nameparameter = req.query.name;
  var nameparametersanitized = sanitizer.escape(nameparameter);
    ImageSchema.find({'title' : new RegExp(nameparametersanitized, 'i')}, function(err, users) {
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
    ImageSchema.find({'title' : new RegExp(nameparametersanitized, 'i')}, function(err, users) {
      if (err) throw err;

      res.json(users);
    });
  });

app.get('/api/imagefile', function(req,res){
 var nameparameter = req.query.name;
  // console.log(nameparameter);
  var nameparametersanitized = sanitizer.escape(nameparameter);
    // ImageSchema.find({'source' : new RegExp(nameparametersanitized, 'i')}, 'source', function(err, users) {
    //   if (err) throw err;

      res.sendFile(path.join(__dirname, '../public/assets/images/', nameparametersanitized));
    //   console.log(users);
    // });

  //   ImageSchema.findOne({ 'source': nameparametersanitized }, 'source', function (err, person) {
  //   if (err) return handleError(err);
  //   console.log(users);
  // })
    
    // if(req.user){
    //     res.sendFile('/public/assets/images/cat.jpg');
    // } else {
    //     res.status(401).send('Authorization required!');
    // }
});

  //INSERT NEW IMAGE (POST)
  app.post('/api/image', function(req, res){
    var imagesource = req.body.source;
console.log("first HERE POST");
console.log("THIS IS IMAGESTRNIG: " + imagesource);
    res.send(req.body);

    //sanitizing
    var sanitizename = sanitizer.escape(req.body.timestamp);
    // var sanitizebplace = sanitizer.escape(imagesource);

    var newImageSchema = new ImageSchema({
      timestamp: sanitizename,
      source: imagesource,
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
        mv(path.join(__dirname, '../public/assets/temp/', imagesource), path.join(__dirname, '../public/assets/images/', imagesource), function(err) {
          // done. it tried fs.rename first, and then falls back to 
          // piping the source file to the dest file and then unlinking 
          // the source file. 
        });
      }

    });

  });

  //UPLOAD IMAGE
  app.post('/api/uploadfile', function(req, res){
console.log("upload method");
    // var form = new formidable.IncomingForm();
 
    // form.parse(req, function(err, fields, files) {
    //   res.writeHead(200, {'content-type': 'text/plain'});
    //   res.write('received upload:\n\n');
    //   res.end(util.inspect({fields: fields, files: files}));
    // });

    var form = new formidable.IncomingForm();
    console.log(form);
    form.uploadDir = "public/assets/temp/";
 
    form.parse(req, function(err, fields, files) {
      // res.writeHead(200, {'content-type': 'text/plain'});
      // res.write('received upload:\n\n');
      // res.end(util.inspect({fields: fields, files: files}));
      
      console.log("this is the file: " + files.file.path)

      //returns image name to client
      var filename = path.basename(files.file.path);
      res.json(filename);
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
