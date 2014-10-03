var mongoose = require('mongoose');
var _ = require('underscore');

var Schema = mongoose.Schema;

var Comments_Schema = mongoose.Schema({
    body  : {type: String, required: true, trim: true},
    created: { type: Date, default: Date.now, required: true },
    parent: { type: String, default: null },
    img_number: { type: Schema.Types.ObjectId, default: null , ref: "Image"},
    user : {type: Schema.Types.ObjectId, required: true, ref: "User"},
    user_wall : {type: Schema.Types.ObjectId, default: null, ref: "User"}
});

// Enable Mongoose getter functions
Comments_Schema.set('toObject', { getters: true , setters: true , virtuals: true });
Comments_Schema.set('toJSON', { getters: true , setters: true ,virtuals: true });
var Comment = mongoose.model('Comments', Comments_Schema);


// Export the Mongoose model
module.exports = Comment;