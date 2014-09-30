define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'jquery.cookie'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        cookie
    ) {

        var Session = Backbone.Model.extend({

            idAttribute: '_id',

            defaults: {
                _id: null,
                profile_pic: null,
                first_name: null,
                last_name: null,
                full_name: null,
                about_me: null
            },


            // Loads session information from cookie
            load: function() {
                this.set({
                    _id: $.cookie('_id'),
                    profile_pic: $.cookie('profile_pic'),
                    full_name: $.cookie('full_name')
                });
            },

            initialize: function() {
                this.load();
            },

            isAuthenticated: function() {
                return this.get("_id");
            },

            clear: function() {
                $.removeCookie('_id');
                $.removeCookie('profile_pic');
                $.removeCookie('full_name');
                this.unset("_id");
                this.unset("profile_pic");
                this.unset("full_name");
            },

            remove: function(key) {
                $.removeCookie(key);
                this.load();
            },

            setCookie: function(key, value) {
                $.cookie(key, value);
                this.load();
            },

            // Saves Session information to cookie
            save: function(result, callback) {
                this.set({
                    _id: result._id,
                    profile_pic: result.profile_pic,
                    full_name: result.full_name
                });                
                $.cookie('_id', result._id);
                $.cookie('profile_pic', result.profile_pic);
                $.cookie('full_name', result.full_name);
                callback();
            }


        });
        // export stuff:
        return Session;
    });
