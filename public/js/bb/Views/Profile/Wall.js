define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Profile/wall.html',
        'bb/Views/Profile/Comment'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template,
        Comment
    ) {

        var Wall = Marionette.View.extend({

            className: "Wall",

            template: Handlebars.compile(Template),

            events: {
               "keypress #new-todo"      : "newComment"
            },

            initialize: function() {

            },

            render: function() {
                $(this.el).html(this.template());
                return this;
            },

            newComment:function(event){
              if (event.keyCode != 13) return;
                var target = event.target;
                if(target.value === ""){
                 $(this.el).find("#new-todo").attr('placeholder','Please try again!');
                 return;
                }
              var comment = new Comment();
              $("#wall", this.el).prepend(comment.el);
            },

            onClose: function() {

            }
        });
        // export stuff:
        return Wall;
    });
