var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SubComment_Schema = mongoose.Schema({
    body  : {type: String, required: true},
    created: { type: Date, default: Date.now },
    user : {type: Schema.Types.ObjectId, required: true, ref: "User"}
});

var Comments_Schema = mongoose.Schema({
    body  : {type: String, required: true},
    created: { type: Date, default: Date.now },
    user : {type: Schema.Types.ObjectId, required: true, ref: "User"},
    sub_comments  : [SubComment_Schema]
});

module.exports = mongoose.model('Comments', Comments_Schema);