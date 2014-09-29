define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Pictures/Pictures.html'
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

        var Pictures = Marionette.View.extend({

            className: "Pictures",

            template: Handlebars.compile(Template),

            events: {
                
            },

            initialize: function() {
                
            },

            render: function() {
                $(this.el).html(this.template());
                return this;
            },

            onClose: function() {

            }
        });
        // export stuff:
        return Pictures;
    });
