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

        var Comment = Backbone.Model.extend({

            idAttribute: '_id',

            defaults: {
                body  : null,
                user : null,
                parent: null
            }

        });
        // export stuff:
        return Comment;
    });
