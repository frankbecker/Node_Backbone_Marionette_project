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
              if (event.keyCode != 13) return;
                var target = event.target;
                if(target.value === ""){
                 $(this.el).find(".comment").attr('placeholder','Please try again!');
                 return;
                }
              var subcomment = new SubComment();
              $(".sub_container", this.el).prepend(subcomment.el);
            },

            onClose: function() {

            }
        });
        // export stuff:
        return Comment;
    });
