var mongoose = require('mongoose');
var Image = require('../models/schema_image');

exports.Image_findById = function(req, res) {
    var id = req.params.id;
    Image.findOne({ _id: id }, function(err, image){
        if (err) return console.error(err);
         res.send(image);
    });
};

exports.findAll = function(req, res) {
    var album_id = req.query.album_id;
    Image.find({'album': album_id} , function(err, image_collection){
        if (err) return console.error(err);
         res.send(image_collection);
    });
};

exports.addImage = function(req, res) {
    var image = req.body;
    var Image_model = new Image(image);
    Image_model.save(function (err, new_image) {
      if (err) return console.error(err);
      res.send(new_image);
    });
};

exports.updateImage = function(req, res) {
    var _id = req.params.id;
    var image = req.body;
        Image.update({'_id':_id}, image, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating User: ' + err);
                res.send(500,{'error':'An error updating image'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(image);
            }
        });
};

exports.deleteImage = function(req, res) {
    var id = req.params.id;

        Image.findOne({'_id':id }, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                result.remove();
                res.send(result);
            }
        });
};