var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Image_Schema = mongoose.Schema({
    album  : {type: String, required: true, trim: true},
    img_name  : {type: String, required: true, trim: true},
    description  : {type: String, trim: true},
    created: { type: Date, default: Date.now, required: true },
    user : {type: Schema.Types.ObjectId, required: true, ref: "User"},
    img_cover: { type: Boolean, default: false }
});

// Enable Mongoose getter functions
Image_Schema.set('toObject', { getters: true , setters: true , virtuals: true });
Image_Schema.set('toJSON', { getters: true , setters: true ,virtuals: true });
var Image = mongoose.model('Image', Image_Schema);


// Export the Mongoose model
module.exports = Image;