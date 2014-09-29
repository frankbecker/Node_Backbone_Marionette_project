var mongoose = require('mongoose');
var Comment = require('../models/schema_comment');
var fs = require("fs");
var _ = require('underscore');

exports.findById = function(req, res) {
    var id = req.params.id;
    Comment.findOne({ _id: id }, function(err, Comment){
        if (err) return console.error(err);
         res.send(Comment);
    });
};

exports.findByUser = function(req, res) {
    var id = req.query.user_id;
    var limit = 40;
    Comment.find({ user_wall: id }).populate('user').limit(limit).exec(function(err, collection) {
        if (err) return console.error(err);
        //!ATTENTION I am using this functino in order to remove both username and password from our User object
        // I am trying to set up a getter in order to fix this issue, but I'll need to look deeper into this problem
        var temp_collection = {};
        _.each(collection , function(model){
            model.user.local = "";
            Comment.find({ parent: id },function(err, sub_collection) {
                _.each(sub_collection, function(sub){
                    collection.push(sub);
                });
            });
        });
         res.send(collection);
    });
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
            }
        });
};