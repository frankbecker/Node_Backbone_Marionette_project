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
                user : null
            },
            
            initialize: function() {
                this.url = "/comments/"+this.get("_id");
            }

        });
        // export stuff:
        return Comment;
    });
