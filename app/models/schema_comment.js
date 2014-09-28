var mongoose = require('mongoose');
var hooker = require('hooker');

var Schema = mongoose.Schema;

var SubComment_Schema = mongoose.Schema({
    body  : {type: String, required: true},
    created: { type: Date, default: Date.now },
    index : {type: Number, required: true},
    user : {type: Schema.Types.ObjectId, required: true, ref: "User"}
});

var Comments_Schema = mongoose.Schema({
    body  : {type: String, required: true},
    created: { type: Date, default: Date.now },
    user : {type: Schema.Types.ObjectId, required: true, ref: "User", set: get_id},
    sub_comments  : [SubComment_Schema]
});

function get_id (user) {
    console.log("Get Id function");
    console.log(user);
  return user;
}
// Enable Mongoose getter functions
Comments_Schema.set('toObject', { getters: true , setters: true , virtuals: true });
Comments_Schema.set('toJSON', { getters: true , setters: true ,virtuals: true });
var Comment = mongoose.model('Comments', Comments_Schema);


// 
// Utilize hooks for update operations. We do it in this way because MongooseJS
// does not natively support update hooks at the Schema level. This is a way
// to support it.
hooker.hook (Comment, 'update', {
  pre: function () {
    // Insert any logic you want before updating to occur here
    console.log('Comment pre update');
    console.log(Comment);
  },
  post: function () {
    // Insert any logic you want after updating to occur here
    console.log('Comment post update');
  }
});

// Export the Mongoose model
module.exports = Comment;