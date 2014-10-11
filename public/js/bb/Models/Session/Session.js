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

            urlRoot: "/user",

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
                    full_name: $.cookie('full_name'),
                    notif_before_last_checked: $.cookie('notif_before_last_checked'),
                    notif_last_checked: $.cookie('notif_last_checked')
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
                $.removeCookie('profile_pic');
                $.removeCookie('full_name');
                this.unset("_id" , {silent: true});
                this.unset("profile_pic", {silent: true});
                this.unset("full_name", {silent: true});
                this.unset("notif_before_last_checked", {silent: true});
                this.unset("notif_last_checked", {silent: true});
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
            save_session: function(result, callback) {
                this.set({
                    _id: result._id,
                    profile_pic: result.profile_pic,
                    full_name: result.full_name,
                    notif_before_last_checked: result.notif_before_last_checked,
                    notif_last_checked: result.notif_last_checked
                });                
                $.cookie('_id', result._id);
                $.cookie('profile_pic', result.profile_pic);
                $.cookie('full_name', result.full_name);
                $.cookie('notif_before_last_checked', result.notif_before_last_checked);
                $.cookie('notif_last_checked', result.notif_last_checked);
                if(!callback)return;
                callback();
            }


        });
        // export stuff:
        return Session;
    });
