define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Pictures/Album/album_cover.html'
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

        var Album_Cover = Marionette.View.extend({

            className: "Album_Cover",

            tagName: 'li',

            template: Handlebars.compile(Template),

            events: {
                
            },

            initialize: function() {
                this.listenTo(this.model, "change", this.render);
                this.render();
            },

            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            },

            onClose: function() {

            }
        });
        // export stuff:
        return Album_Cover;
    });
