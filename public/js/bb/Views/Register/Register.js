define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Register/Register.html'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template
    ) {

        var Register = Marionette.View.extend({

            className: "Register",

            template: Handlebars.compile(Template),

            events: {
            },

            initialize: function() {
                this.render();
            },

            render: function() {
                $(this.el).html(this.template());
                return this;
            },

            onClose: function() {

            }
        });
        // export stuff:
        return Register;
    });
