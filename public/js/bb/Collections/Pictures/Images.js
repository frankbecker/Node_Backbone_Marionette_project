define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'bb/Models/Pictures/Image'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Image
    ){

        var Images = Backbone.Collection.extend({
          model: Image,
          url : "/image"
        });
        // export stuff:
        return Images;
    });