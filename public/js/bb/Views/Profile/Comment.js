define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Profile/comment.html',
        'bb/Views/Profile/SubComment'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template,
        SubComment
    ){
        var Comment = Marionette.View.extend({

            className: "Comment",

            template: Handlebars.compile(Template),

            events: {
               "keypress .comment"      : "newSubComment"
            },

            initialize: function() {
                this.render();
            },

            render: function() {
                $(this.el).html(this.template());
                return this;
            },

            newSubComment:function(event){

            },

            onClose: function() {

            }
        });
        // export stuff:
        return Comment;
    });
