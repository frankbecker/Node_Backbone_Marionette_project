define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Pictures/Album/image_thumb.html'
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

        var Image_Thumb = Marionette.View.extend({

            className: "Image_Thumb",

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
        return Image_Thumb;
    });
