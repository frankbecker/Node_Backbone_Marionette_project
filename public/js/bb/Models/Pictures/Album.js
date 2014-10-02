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
    ) {

        var Album = Backbone.Model.extend({

            urlRoot: "/album",

            idAttribute: "_id",

            defaults: {
                    name  : null,
                    description  : null,
                    img_cover: null,  /// _id
                    user : null   ///  _id
            },

            initialize: function () {
                this.validators = {};

                this.validators.name = function (value) {
                    return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a Name"};
                };

                /*this.validators.description = function (value) {
                    return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter Last Name"};
                };*/
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
        return Album;
    });
