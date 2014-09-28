var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Comments_Schema = mongoose.Schema({
    body  : {type: String, required: true, trim: true},
    created: { type: Date, default: Date.now },
    parent: { type: String, default: null },
    user : {type: Schema.Types.ObjectId, required: true, ref: "User"}
});

// Enable Mongoose getter functions
Comments_Schema.set('toObject', { getters: true , setters: true , virtuals: true });
Comments_Schema.set('toJSON', { getters: true , setters: true ,virtuals: true });
var Comment = mongoose.model('Comments', Comments_Schema);


// Export the Mongoose model
module.exports = Comment;