define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Profile/wall.html',
        'bb/Views/Profile/Comment',
        'bb/Collections/Comments/Comments'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template,
        Comment,
        Comments
    ) {

        var Wall = Marionette.View.extend({

            className: "Wall",

            template: Handlebars.compile(Template),

            events: {
               "keypress #new-todo"      : "newComment"
            },

            initialize: function() {
                this.collection = new Comments();
                this.user_logged_id = App.Session.get("_id");
            },

            render: function() {
                var self = this;
                $(this.el).html(this.template());
                setTimeout(function(){
                    self.populate_wall();
                },0);
                return this;
            },

            populate_wall : function(){
                var user_id = this.user_logged_id;
                this.collection.fetch({
                    
                   success:function(collection, response, options){
                    console.log(collection);
                   },

                   fail:function(collection, response, options){

                   }
               });
            },

            newComment:function(event){
              if (event.keyCode != 13) return;
                var target = event.target;
                if(target.value === ""){
                 $(this.el).find("#new-todo").attr('placeholder','Please try again!');
                 return;
                }
              var new_comment = this.collection.create({
                  body: target.value,
                  user: this.user_logged_id
               });
              var comment = new Comment();
              $("#wall", this.el).prepend(comment.el);
            },

            onClose: function() {

            }
        });
        // export stuff:
        return Wall;
    });
