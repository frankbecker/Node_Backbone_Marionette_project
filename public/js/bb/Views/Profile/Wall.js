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
                this.user_logged_in = App.Session;
                this.new_comment = null;
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
                var user_id = this.user_logged_in.get("_id");
                var self = this;
                this.collection.fetch({

                   success:function(collection, response, options){
                    self.collection.each(function(model){
                        self.insert_needed_info_into_comments(model);
                    });
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
              var self = this;
              this.new_comment = this.collection.create({
                  body: target.value,
                  user: this.user_logged_in.get("_id")
                },{ silent: true, wait: true, success: this.insert_needed_info_into_comments(this.new_comment), fail: this.created_comment_fail} );

            },

            created_comment_success : function(new_comment, response, options){
           
            },

            created_comment_fail: function(new_comment, response, options){
                console.log("something went wrong when creating a new commment");
            },

            insert_needed_info_into_comments : function(model){
                var comment_user = model.get('user');
                if( comment_user._id == this.user_logged_in.get('_id')){
                    model.set("match", true);
                }
                model.set("user_logged_in", this.user_logged_in.toJSON());
                var comment = new Comment({model: model});
                $("#wall", self.el).prepend(comment.el);
            },

            onClose: function() {

            }
        });
        // export stuff:
        return Wall;
    });
