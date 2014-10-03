// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var fs = require("fs");

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : {type: String, index: {unique: true}},
        password     : {type: String, required: true, trim: true}
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
    first_name       : {type: String, required: true, trim: true},
    last_name        : {type: String, required: true, trim: true},
    profile_pic      : {type: String, trim: true},
    about_me         : {type: String, required: true, trim: true},
    phone_number     : {type: String, required: true, trim: true},
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

userSchema.path('profile_pic').set(function (newVal) {
  var originalVal = this.profile_pic;

    var app_path = app.get('root_directory');
    var newPath = app_path+"/public/pics/" + originalVal;
    console.log(newPath);
        fs.exists(newPath, function (exists) {
            console.log("File does exist");
            fs.unlink(newPath, function (err) {
              if (err) return console.error("Error Deleting user Profile Image: "+err);
              console.log('successfully deleted : '+ newPath );
            });
        });

  return newVal;
});

userSchema.pre('save', function (next) {
    console.log("Pre Save");
    console.log(this);
    next();
});

// Enable Mongoose getter functions
userSchema.set('toObject', { getters: true , setters: true , virtuals: true });
userSchema.set('toJSON', { getters: true , setters: true ,virtuals: true });
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
