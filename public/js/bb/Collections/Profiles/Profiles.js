define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'bb/Models/Profile/Profile'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Profile
    ){

        var Profiles = Backbone.Collection.extend({
          model: Profile,
          url : "/user"
        });
        // export stuff:
        return Profiles;
    });
