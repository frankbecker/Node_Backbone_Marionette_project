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
    var id = req.user._id;
    Comment.find({ user: id }).populate('user').populate('sub_comments.user').exec(function(err, collection) {
        if (err) return console.error(err);
        //!ATTENTION I am using this functino in order to remove both username and password from our User object
        // I am trying to set up a getter in order to fix this issue, but I'll need to look deeper into this problem
        _.each(collection , function(model){
            model.user.local = "";
        });
         res.send(collection);
    });
};

exports.addComment = function(req, res) {
    var comment = req.body;
    var Comment_model = new Comment(comment);
    Comment_model.save(function (err, new_comment) {
      if (err) return console.error(err);
      res.send(new_comment);
    });
};

exports.updateComment = function(req, res) {
    var _id = req.params.id;
    var comment = req.body;
    comment.user = comment.user._id;
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