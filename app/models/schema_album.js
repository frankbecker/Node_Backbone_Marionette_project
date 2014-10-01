var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Album_Schema = mongoose.Schema({
    name  : {type: String, trim: true},
    description  : {type: String, trim: true},
    created: { type: Date, default: Date.now, required: true },
    img_cover: { type: Schema.Types.ObjectId, ref: "Image" },
    user : {type: Schema.Types.ObjectId, required: true, ref: "User"}
});

// Enable Mongoose getter functions
Album_Schema.set('toObject', { getters: true , setters: true , virtuals: true });
Album_Schema.set('toJSON', { getters: true , setters: true ,virtuals: true });
var Album = mongoose.model('Album', Album_Schema);


// Export the Mongoose model
module.exports = Album;