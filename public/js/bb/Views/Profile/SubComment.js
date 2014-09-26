define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Profile/sub_comment.html'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template
    ){

        var SubComment = Marionette.View.extend({

            className: "SubComment",

            template: Handlebars.compile(Template),

            events: {
               //"keypress .comment"      : "newSubComment"
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
        return SubComment;
    });
