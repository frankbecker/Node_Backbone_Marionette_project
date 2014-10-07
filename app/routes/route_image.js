var mongoose = require('mongoose');
var Image = require('../models/schema_image');
var Album = require('../models/schema_album');

exports.Image_findById = function(req, res) {
    var id = req.params.id;
    Image.findOne({ _id: id }).populate('user').exec(function(err, image) {
        if (err) return res.send(404,"Image not found");
         res.send(image);
    });
};

exports.findAll = function(req, res) {
    var album_id = req.query.album_id;
    Image.find({'album': album_id}).populate('user').exec(function(err, image_collection) {
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
    var temp_user = image.user;
    image.user = image.user._id;
        Image.findOneAndUpdate({'_id':_id}, image, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating User: ' + err);
                res.send(500,{'error':'An error updating image'});
            } else {
                console.log('' + result + ' document(s) updated');
                if(image.img_cover == true){
                    Album.findOneAndUpdate({'_id':image.album}, { $set: { "img_cover" : image._id } }, function(error, result) {
                        if(error){
                            console.log('Could not update Album with new cover: ' + err);
                        }
                    });
                }
                image.user = temp_user;
                res.send(image);
            }
        });
};

exports.deleteImage = function(req, res) {
    var id = req.params.id;

        Image.findOne({'_id':id }, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                result.remove();
                res.send(result);
            }
        });
};