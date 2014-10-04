define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone
    ){

        var Image = Backbone.Model.extend({

            urlRoot: "/image",

            idAttribute: '_id',

            defaults: {
                album  : null,
                img_name  : null,
                name: null,
                description  : null,
                user : null,
                img_cover: false
            }

        });
        // export stuff:
        return Image;
    });
