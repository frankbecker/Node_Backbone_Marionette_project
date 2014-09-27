define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'bb/Models/Comment/Comment'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Comment
    ){

        var Comments = Backbone.Collection.extend({
          model: Comment,
          url : "/comments"
        });
        // export stuff:
        return Comments;
    });
