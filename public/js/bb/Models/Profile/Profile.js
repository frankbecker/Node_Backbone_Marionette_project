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

        var Profile = Backbone.Model.extend({

            urlRoot: "/user",

            idAttribute: "_id",

            defaults: {
                profile_pic: null,
                first_name: null,
                last_name: null,
                phone_number: null,
                about_me: null
            },

            initialize: function () {
                this.validators = {};

                this.validators.first_name = function (value) {
                    return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter First Name"};
                };

                this.validators.last_name = function (value) {
                    return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter Last Name"};
                };

                this.validators.phone_number = function (value) {
                    return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a Phone Number"};
                };

                this.validators.about_me = function (value) {
                    return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a profile description."};
                };
            },

            validateItem: function (key) {
                return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
            },

            // TODO: Implement Backbone's standard validate() method instead.
            validateAll: function () {

                var messages = {};

                for (var key in this.validators) {
                    if(this.validators.hasOwnProperty(key)) {
                        var check = this.validators[key](this.get(key));
                        if (check.isValid === false) {
                            messages[key] = check.message;
                        }
                    }
                }

                return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
            }

        });
        // export stuff:
        return Profile;
    });
