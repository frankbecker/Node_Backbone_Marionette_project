define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/SideBar/SideBar.html'
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

        var SideBar = Marionette.View.extend({

            className: "SideBar",

            template: Handlebars.compile(Template),

            events: {
                
            },

            initialize: function() {

            },

            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            },

            onClose: function() {

            }
        });
        // export stuff:
        return SideBar;
    });
