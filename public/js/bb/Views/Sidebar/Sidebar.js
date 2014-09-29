define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Sidebar/SideBar.html'
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
                this.listenTo(this.model, 'change', this.render);
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
