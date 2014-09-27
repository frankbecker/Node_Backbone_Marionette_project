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
            defaults: {
                _id: null,
                body  : null,
                created  : null,
                user : null
            },

            initialize: function() {
               
            }

        });
        // export stuff:
        return Comment;
    });
