define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'bb/Models/Pictures/Album'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Album
    ){

        var Albums = Backbone.Collection.extend({
          model: Album,
          url : "/album"
        });
        // export stuff:
        return Albums;
    });