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
                    name: $.cookie('name'),
                    profile_in_view : $.cookie('profile_in_view')
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
                $.removeCookie('first_name');
                $.removeCookie('last_name');
                $.removeCookie('full_name');
                $.removeCookie('profile_in_view');
                this.unset("_id");
                this.unset("profile_pic");
                this.unset("first_name");
                this.unset("last_name");
                this.unset("full_name");
                this.unset("profile_in_view");
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
            save: function(result) {
                $.cookie('_id', result._id);
                $.cookie('profile_pic', result.profile_pic);
                $.cookie('name', result.name);
            }


        });
        // export stuff:
        return Session;
    });
