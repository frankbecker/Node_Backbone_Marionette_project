var mongoose = require('mongoose');
var _ = require('underscore');
var moment = require("moment");

var Schema = mongoose.Schema;

var Comments_Schema = mongoose.Schema({
    body  : {type: String, required: true, trim: true},
    created: { type: Date, default: Date.now, required: true , get: convertDate },
    parent: { type: String, default: null },
    img_number: { type: Schema.Types.ObjectId, default: null , ref: "Image"},
    user : {type: Schema.Types.ObjectId, required: true, ref: "User"},
    user_wall : {type: Schema.Types.ObjectId, default: null, ref: "User"},
    type: { type: String, default: "comment"}
});

function convertDate (date_value) {
    var new_date_value = moment(date_value).calendar();
    return new_date_value;
}

// Enable Mongoose getter functions
Comments_Schema.set('toObject', { getters: true , setters: true , virtuals: true });
Comments_Schema.set('toJSON', { getters: true , setters: true ,virtuals: true });
var Comment = mongoose.model('Comments', Comments_Schema);


// Export the Mongoose model
module.exports = Comment;