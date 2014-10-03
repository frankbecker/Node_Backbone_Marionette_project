var mongoose = require('mongoose');
var Comment = require('../models/schema_comment');
var fs = require("fs");
var _ = require('underscore');

var Schema = mongoose.Schema;

var Image_Schema = mongoose.Schema({
    album  : {type: Schema.Types.ObjectId, required: true, trim: true},
    img_name  : {type: String, required: true, trim: true},
    description  : {type: String, trim: true},
    created: { type: Date, default: Date.now, required: true },
    user : {type: Schema.Types.ObjectId, required: true, ref: "User"},
    img_cover: { type: Boolean, default: false }
});




Image_Schema.pre('remove', function(next) {
    console.log("removing image");
    var originalVal = this.img_name;
    var app_path = app.get('root_directory');
    var newPath = app_path+"/public/pics/" + originalVal;
        fs.exists(newPath, function (exists) {
            console.log("File does exist");
            fs.unlink(newPath, function (err) {
              if (err) return console.error("Error Image: "+err);
              console.log('successfully deleted : '+ newPath );
            });
        });
    Comment.find({'img_number': this._id},function(err,docs){
        if (err)return console.log('error occured in the database');
        _.each(docs, function(doc){
            doc.remove();
        });
    });
    next();
});

// Enable Mongoose getter functions
Image_Schema.set('toObject', { getters: true , setters: true , virtuals: true });
Image_Schema.set('toJSON', { getters: true , setters: true ,virtuals: true });

var Image = mongoose.model('Image', Image_Schema);
// Export the Mongoose model
module.exports = Image;