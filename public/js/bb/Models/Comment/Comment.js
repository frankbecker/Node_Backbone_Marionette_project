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
                _id: null,
                body  : null,
                created  : null,
                user : null,
                parent: null
            }

        });
        // export stuff:
        return Comment;
    });
