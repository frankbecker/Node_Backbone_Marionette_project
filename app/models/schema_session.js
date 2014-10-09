var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Session_Schema = mongoose.Schema({
    session  : Object,
    expires  : Date,
    user:  String
});

// Enable Mongoose getter functions
Session_Schema.set('toObject', { getters: true , setters: true , virtuals: true });
Session_Schema.set('toJSON', { getters: true , setters: true ,virtuals: true });

var Session = mongoose.model('Session', Session_Schema , 'sessions');

// Export the Mongoose model
module.exports = Session;