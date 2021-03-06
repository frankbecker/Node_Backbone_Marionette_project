var mongoose = require('mongoose');
var User = require('../models/schema_user');
var Sessions = require('../models/schema_session');
var fs = require("fs");
var _ = require('underscore');

exports.logOut = function(req, res){
    console.log("USER LOGOUT ----  user_logged_in");
    var user_id = req.app.get("user_logged_in");
    console.log(user_id);
    Sessions.findOne({ 'user' : user_id }, function(err, session) {
        if (err) return res.send(404,"err deleting session");
        try{
            req.logout();
            session.remove();
        }catch(error){
            res.send(404,"session not found");
        }
        req.session.destroy();
        res.send(200,'Successfully delete session');
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log(id);
    User.findOne({ _id: id }, function(err, User){
        if (err) return res.send(404,"User not found");
         res.send(User);
    });
};

exports.findAll = function(req, res) {
    var _id = req.query.user_id;
    var my_array = [];

    if(_id){
        User.find({ '_id': { $ne: _id } } , function(err, collection) {
            _.each(collection, function(friend) {
                friend.local = "";
                my_array.push(friend._id.toString());
            });
            res.send(collection);
        });
        return;
    }

    User.find({}, function(err, collection) {
            _.each(collection, function(friend) {
                friend.local = "";
                my_array.push(friend._id.toString());
            });
            Sessions.find({ 'user' : {$in: my_array } }, function(err, sessions) {
                //console.log(sessions);
                _.each(sessions,function(sess, index){
                    console.log(index);
                    console.log(sess.user);
                    _.each( collection ,function (friend) {
                        if(friend._id.toString() == sess.user){
                            friend.online = true;
                        }
                    });
                });
                res.send(collection);
            });
    });
};

exports.addUser = function(req, res) {
    var user = req.body;
    var User_model = new User(user);
    User_model.save(function (err, fluffy) {
      if (err) return console.error(err);
      console.log("User was saved");
    });
};

exports.updateUser = function(req, res) {
    var _id = req.params.id;
    var user = req.body;
    var update_notif = user.update_notif;
   User.findOne({ "_id": _id }, function (err, subject) {
    if (err) return res.send(404,"User not found");
    if(update_notif){
          subject.set({
                notif_last_checked               : Date.now(),
                notif_before_last_checked        : user.notif_last_checked
          });
     }else{
        subject.set({
            first_name       : user.first_name,
            last_name        : user.last_name,
            profile_pic      : user.profile_pic,
            about_me         : user.about_me,
            phone_number     : user.phone_number
        });
     }

      // You can only pass one param to the model's save method
      subject.save(function (err, doc, numAffected) {
        console.log(doc);
        if (err) return console.error(err);
        doc.local = "";
          res.send(doc);
      });
    });
};

exports.deleteUser = function(req, res) {
    var id = req.params.id;

        User.findOneAndRemove({'_id':id }, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
};

exports.upload_img = function(req, res) {
        fs.readFile(req.files.file.path, function (err, data) {
            var imageName = req.files.file.name;
            var file_type = req.files.file.type;
            var type_array = file_type.split("/");
            var type = type_array[0];
            var ext = type_array[1];
            var random_image_name = Math.random().toString(36).substring(7);
            random_image_name = random_image_name + Date.now();
            random_image_name = random_image_name+"."+ext;
            /// If there's an error
            if(!imageName){
                console.log("There was an error");
                res.writeHead (500);
                res.end();

            }else if(type !== "image"){

                console.log("There was an error, fyle type not an image");
                res.writeHead (500);
                res.end();

            } else {
            var app_path = req.app.get('root_directory');
            var newPath = app_path+"/public/pics/" + random_image_name;

            /// write file to uploads/fullsize folder
            fs.writeFile(newPath, data, function (err) {
                if(err)return;
                /// let's see it
                res.send(random_image_name);

                });
            }
        });
};