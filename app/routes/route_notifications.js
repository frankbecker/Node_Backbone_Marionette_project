var mongoose = require('mongoose');
var Comment = require('../models/schema_comment');
var _ = require('underscore');

exports.findAll = function(req, res) {
    var user_id = req.query.user_id;
    var last_checked = req.query.notif_time;
    last_checked = new Date(last_checked);
    ///  I probably need a better implementation for this but it works for now
    ///  I think that I could implement this differently, maybe by having a Notification collection which gets updated with every entry.
    ///  I definitely need a better implementation for this.
    var temp_collection = [];
    var promise = Comment.find({ user_wall: user_id ,'created': { "$gte": last_checked }, 'user': { $ne: user_id } }).populate('user').populate("img_number").exec();
    
    promise.then(function(comments){
        _.each(comments, function(comment){
            comment.local = "";
            temp_collection.push(comment);
        });
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
        var array_of_ids = [];
        _.each(comments, function(comment){
            array_of_ids.push(comment._id);
        });
       return Comment.find({ 'parent': { $in: array_of_ids }, 'created': { "$gte": last_checked }, 'user': { $ne: user_id } }).exec();
       
    }).then(function (sub_collection) {
        _.each(sub_collection, function(sub){
            sub.user.local = "";
            temp_collection.push(sub);
        });
        return Comment.find({ 'user': user_id, 'img_number': { $ne: null } }).exec();
    }).then(function (img_comments) {
        var array_of_img_ids = [];
        _.each(img_comments, function(img){
            array_of_img_ids.push(img.img_number);
        });
        return Comment.find({'img_number': { $in: array_of_img_ids }, 'created': { "$gte": last_checked }, 'user': { $ne: user_id } }).populate('user').populate("img_number").exec();
    }).then(function (imgs) {
        _.each(imgs, function(img){
            img.user.local = "";
            temp_collection.push(img);
        });
        temp_collection = _.uniq(temp_collection);  /// I put this in place just in case we have repetitive models
        res.send(temp_collection);
    });
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