var mongoose = require('mongoose');
var Album = require('../models/schema_album');
var Image = require('../models/schema_image');
var fs = require("fs");

exports.Album_findById = function(req, res) {
    var id = req.params.id;
    Album.findOne({ _id: id }).populate('img_cover').exec(function(err, album) {
        if (err) return res.send(404,"Album not found");
         res.send(album);
    });
};

exports.findAll = function(req, res) {
    var user_id = req.query.user_id;
    Album.find({'user': user_id}).populate('img_cover').exec(function(err, collection) {
        if (err) return res.send(404,"Albums not found");
            res.send(collection);
    });
};

exports.addAlbum = function(req, res) {
    console.log(req.body);
    var user_id = req.body.user;
    var album = req.body;
    var img_name = req.body.img_cover;  /// this will get replaced with the _id of the new image, at first it'll be the image name for now on POST
    var description = req.body.description;
    var name = req.body.name;
    delete req.body.img_cover;
    var Album_model = new Album(album);
    Album_model.save(function (err, album_created) {
      if (err) return console.error(err);

      var image_model = new Image({
        "img_name" : img_name ,
        "user" : user_id,
        "album" : album_created._id,
        "img_cover": true,   /// first image will be cover by default
        "description": description,   /// we will create the first image with the name and description of our Album
        "name" : name
         });
      image_model.save(function (error, img_created) {
        if (error) return console.error(error);

        Album.findOneAndUpdate({'_id': album_created._id }, { $set: { "img_cover": img_created._id } }, {safe:true}, function(err_, result) {
            if (err_) return console.error(err_);
            console.log("Logging created");
            console.log(result);
            res.send(result);
        });  //Album.update
      });  ///image_model.save
    });  ///Album_model.save
};

exports.updateAlbum = function(req, res) {
    var _id = req.params.id;
    var album = req.body;
    delete album._id;  /// for some reason, I need to remove this, I'll look deeper into this issue
        Album.update({'_id':_id}, album, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating User: ' + err);
                res.send(500,{'error':'An error has occurred updating album'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(album);
            }
        });
};

exports.deleteAlbum = function(req, res) {
    var id = req.params.id;

        Album.findOne({'_id':id }, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                result.remove();
                res.send(result);
                /*Image.remove( { album : id }, {safe:true}, function(err, result) {
                    if (err) {
                        res.send({'error':'An error has occurred removing images associated with album - ' + err});
                    } else {
                        console.log('' + result + ' delete all images associated with album document(s) deleted');
                    }
                });*/
            }
        });
};