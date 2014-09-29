// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : {type: String, index: {unique: true}},
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    first_name       : String,
    last_name        : String,
    profile_pic      : String,
    about_me         : String,
    phone_number     : String,
    created          : { type: Date, default: Date.now, required: true }
    
}, { strict: false });

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.remove_local = function(){
    return delete this.local;
};

userSchema.virtual('full_name').get(function () {
  return this.first_name + ' ' + this.last_name;
});

userSchema.virtual('full_name').set(function () {
  return this.first_name + ' ' + this.last_name;
});

userSchema.set('toJSON', {
    virtuals: true
});

// Enable Mongoose getter functions
userSchema.set('toObject', { getters: true , setters: true , virtuals: true });
userSchema.set('toJSON', { getters: true , setters: true ,virtuals: true });
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
