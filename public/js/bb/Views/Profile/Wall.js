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
                this.listenTo(App, "change:comment_editing_no_comment_fecthing", this.handle_interval_fetching);
                this.listenTo(this.collection, 'add',this.insert_needed_info_into_comments);
                this.profile_in_view = App.Profile_in_View;
                this.new_comment = null;
                this.Interval = null;
                this.childViews = [];      //GARBAGE COLLECTION
                this.comment_editing_no_comment_fecthing = App.GET_comment_editing_no_comment_fecthing();
            },

            render: function() {
                var self = this;
                $(this.el).html(this.template());
                setTimeout(function(){
                    self.populate_wall();
                },0);
                setTimeout(function(){
                   // self.fetch_comments();
                },6000);
                return this;
            },

            populate_wall : function(){
                var user_id = this.profile_in_view.get("_id");
                var self = this;
                this.collection.fetch({

                   data: $.param({ user_id: user_id}),

                   silent: true,

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
                  user: this.user_logged_in.get("_id"),
                  user_wall: this.profile_in_view.get("_id")
                },
                {
                wait : true,    // waits for server to respond with 200 before adding newly created model to collection
                silent: true,
                success : function(resp){
                    self.insert_needed_info_into_comments(resp);
                },
                error : function(err) {
                    console.log("Error creating new Comment");
                }
                });

            },

            created_comment_success : function(new_comment, response, options){
           
            },

            created_comment_fail: function(new_comment, response, options){
                console.log("something went wrong when creating a new commment");
            },

            handle_interval_fetching: function(){
                this.comment_editing_no_comment_fecthing = App.GET_comment_editing_no_comment_fecthing();
            },

            fetch_comments: function(){
                var self = this;
                this.collection.fetch({
                    update: true,
                    success: function(){

                    },
                    fail: function () {
                        console.log("Something went wrong fetching comments Wall.js");
                    }
                    });

                if(this.Interval){
                  clearInterval(this.Interval);
                  this.Interval = null;
                }
                this.Interval = window.setInterval(function(){self.fetch_comments();},6000);   //Working Working Working        
            },

            insert_needed_info_into_comments : function(model){
                var comment_user = model.get('user');
                if(model.get("parent"))return;
                if( comment_user._id == this.user_logged_in.get('_id')){
                    model.set("match", true);
                }
                model.set("user_logged_in", this.user_logged_in.toJSON());
                var comment = new Comment({model: model, collection: this.collection});
                this.childViews.push(comment);
                $("#wall", this.el).prepend(comment.el);
            },

            onClose: function() {
               if(this.Interval){
                  clearInterval(this.Interval);
                  this.Interval = null;
                }
                _.each(this.childViews, function(childView){
                      if (childView.close){
                        childView.close();
                      }
                });
            }
        });
        // export stuff:
        return Wall;
    });
