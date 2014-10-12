var mongoose = require('mongoose');
var Comment = require('../models/schema_comment');
var fs = require("fs");
var _ = require('underscore');

exports.findById = function(req, res) {
    var id = req.params.id;
    Comment.findOne({ _id: id }, function(err, Comment){
        if (err) return res.send(404,"Comment not found");
         res.send(Comment);
    });
};

exports.findComments = function(req, res) {
    //console.log(req.user);
    var user_id = req.query.user_id;  /// find by user
    var img_id = req.query.img_id;     ///  find by image number
    var comment_id = req.query.comment_id;  /// find by comment _id
    var limit = 500;  // for now    
    /// we don't comments with img_number set
    if(user_id){
        Comment.find({ user_wall: user_id , img_number : null}).populate('user').limit(limit).exec(function(err, collection) {
            if (err) return console.error(err);
            //!ATTENTION I am using this function in order to remove both username and password from our User object
            // I am trying to set up a getter in order to fix this issue, but I'll need to look deeper into this problem
            // Because when we log in we need these values when retrieveing the user object from the Database
            _.each(collection , function(model){
                model.user.local = "";
                Comment.find({ parent: model._id },function(err, sub_collection) {
                    _.each(sub_collection, function(sub){
                        sub.user.local = "";
                        collection.push(sub);
                    });
                });
            });
            res.send(collection);
        });
    }else if(img_id){
        Comment.find({ img_number: img_id }).populate('user').exec(function(err, collection) {
            if (err) return console.error(err);
            _.each(collection , function(model){
                model.user.local = "";
            });
            res.send(collection);
        });
    }else if(comment_id){
        Comment.find({ $or: [ { _id: comment_id }, { parent: comment_id } ] }).populate('user').exec(function(err, collection) {
            if (err) return console.error(err);
            //!ATTENTION I am using this function in order to remove both username and password from our User object
            // I am trying to set up a getter in order to fix this issue, but I'll need to look deeper into this problem
            _.each(collection , function(model){
                model.user.local = "";
            });
            res.send(collection);
        });
    }

};

exports.addComment = function(req, res) {
    var comment = req.body;
    console.log("Posting new comment");
    var Comment_model = new Comment(comment);
    Comment_model.save(function (err, new_comment) {
      if (err) return console.error(err);
      Comment.populate(new_comment, {path:"user"}, function(err, populated_comment) {  ////  this populates our need User field on response after creation
        if (err) return console.error(err);
        res.send(populated_comment);
      });
      
    });
};

exports.updateComment = function(req, res) {
    var _id = req.params.id;
    var comment = req.body;
    comment.user = comment.user._id;   /// we need to get rid of the User object and just update the user with _id field, I am trying to find a better way of doing this, cleaner way
    console.log("updateComment");
    delete comment._id;
    delete comment.created; /// we need to remove the date because we convert when retrieving from the database, and we don't need to update this value
        Comment.update({'_id':_id}, comment, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating Comment: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(comment);
            }
        });
};

exports.deleteComment = function(req, res) {
    var id = req.params.id;
        Comment.findOneAndRemove({'_id':id }, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
                Comment.remove( { parent : id }, {safe:true}, function(err, result) {
                    if (err) {
                        res.send({'error':'An error has occurred removing images associated with album - ' + err});
                    } else {
                        console.log('' + result + ' delete all images associated with album document(s) deleted');
                    }
                });
            }
        });
};