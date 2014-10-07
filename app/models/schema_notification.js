var mongoose = require('mongoose');
var _ = require('underscore');

var Schema = mongoose.Schema;

var Notification_Schema = mongoose.Schema({
    last_checked: { type: Date, default: Date.now, required: true },
    before_last_checked: { type: Date, default: Date.now, required: true },
    user : {type: Schema.Types.ObjectId, required: true, ref: "User"}
});

// Enable Mongoose getter functions
Notification_Schema.set('toObject', { getters: true , setters: true , virtuals: true });
Notification_Schema.set('toJSON', { getters: true , setters: true ,virtuals: true });
var Notification = mongoose.model('Notification', Notification_Schema);


// Export the Mongoose model
module.exports = Notification;