var mongoose = require('mongoose');
var Comment = require('../models/schema_comment');
var async = require("async");
var _ = require('underscore');

exports.findById = function(req, res) {

};

exports.findAll = function(req, res) {
    var user_id = req.query.user_id;
    var last_checked = req.query.notif_time;
    last_checked = new Date(last_checked);
    console.log("logging from notification");
    /// wall comments
    var temp_collection = [];
    var promise = Comment.find({ user_wall: user_id ,'created': { "$gte": last_checked }, 'user': { $ne: user_id } }).populate('user').populate("img_number").exec();
    
    promise.then(function(comments){
        _.each(comments, function(comment){
            comment.local = "";
            temp_collection.push(comment);
        });
       // res.send(temp_collection);
       return Comment.find({ 'user': user_id, parent: { $ne: null } }).exec();
    }).then(function(comments){
       _.each(comments, function(comment){
                Comment.find({ parent: comment.parent, 'created': { "$gte": last_checked }, 'user': { $ne: user_id } }).populate('user').exec(function(err, sub_collection) {
                    _.each(sub_collection, function(sub){
                        sub.user.local = "";
                        temp_collection.push(sub);
                    });
                });
        });
       return Comment.find({ 'user': user_id, 'parent': null }).exec();
    }).then(function(comments){
        console.log("Logging comments where I am parent");

       _.each(comments, function(comment){
                Comment.find({ 'parent': comment._id, 'created': { "$gte": last_checked }, 'user': { $ne: user_id } }).populate('user').exec(function(err, sub_collection) {
                    console.log(sub_collection);
                    _.each(sub_collection, function(sub){
                        sub.user.local = "";
                        temp_collection.push(sub);
                    });
                });
        });
       res.send(temp_collection);
    });
    // find all sub comments
    /*Comment.find({ 'user': user_id, parent: { $ne: null } } , function(err, comments) {
        console.log(comments);
        _.each(comments, function(comment){            
                Comment.find({ parent: comment.parent, 'created': { "$gte": last_checked }, 'user': { $ne: user_id } }).populate('user').exec(function(err, sub_collection) {
                    _.each(sub_collection, function(sub){
                        sub.user.local = "";
                        temp_collection.push(sub);
                    });
                });
        });
    });*/

    //res.send(temp_collection);
};

/*
async.parallel([
    function(callback){
        setTimeout(function(){
            callback(null, 'one');
        }, 200);
    },
    function(callback){
        setTimeout(function(){
            callback(null, 'two');
        }, 100);
    }
],
// optional callback
function(err, results){
    // the results array will equal ['one','two'] even though
    // the second function had a shorter timeout.
});


// an example using an object instead of an array
async.parallel({
    one: function(callback){
        setTimeout(function(){
            callback(null, 1);
        }, 200);
    },
    two: function(callback){
        setTimeout(function(){
            callback(null, 2);
        }, 100);
    }
},
function(err, results) {
    // results is now equals to: {one: 1, two: 2}
});
 */