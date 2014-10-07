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

        var Notifications = Backbone.Collection.extend({
          url : "/notification"
        });
        // export stuff:
        return Notifications;
    });
