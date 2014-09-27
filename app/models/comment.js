var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var SubComment_Schema = mongoose.Schema({
    body  : {type: String, required: true},
    date  : {type: Date, dafault: Date.now},
    user : {type: ObjectId, required: true, ref: "User"}
});

var Comments_Schema = mongoose.Schema({
    body  : {type: String, required: true},
    date  : {type: Date, dafault: Date.now},
    user : {type: ObjectId, required: true, ref: "User"},
    sub_comments  : [SubComment_Schema]
});

module.exports = mongoose.model('Comments', Comments_Schema);