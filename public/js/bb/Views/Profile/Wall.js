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
            /*
            var options = {
                    comment_id : commment_id,
                    sub_comment_id : sub_comment_id
             };
             */
            initialize: function(options) {
                this.collection = new Comments();
                this.user_logged_in = App.Session;
                this.listenTo(App, "change:comment_editing_no_comment_fecthing", this.handle_interval_fetching);
                this.listenTo(App, "user_idle", this.is_user_idle);
                this.listenTo(this.collection, 'add', this.insert_needed_info_into_comments);
                this.user_idle = false;
                this.model = App.Profile_in_View;
                this.new_comment = null;
                this.Interval = null;
                this.childViews = [];      //GARBAGE COLLECTION
                this.view_is_alive = true;
                this.comment_id = options.comment_id;
                this.sub_comment_id = options.sub_comment_id;
                this.comment_editing_no_comment_fecthing = App.GET_comment_editing_no_comment_fecthing();
            },

            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                var self = this;
                setTimeout(function(){
                    self.populate_wall();
                },0);
                if(this.comment_id)return this;
                setTimeout(function(){
                    self.fetch_comments();
                },10000);
                return this;
            },

            populate_wall : function(){
                var param = {};
                if(this.comment_id){
                    $("#todoapp",this.el).addClass("hide");
                    param["comment_id"] = this.comment_id;
                }else{
                    param["user_id"] = this.model.get("_id");
                }
                var self = this;
                this.collection.fetch({

                   data: $.param(param),

                   silent: true,

                   success:function(collection, response, options){
                    self.collection.each(function(model){
                        self.insert_needed_info_into_comments(model);
                    });
                   },

                   error:function(collection, response, options){
                    App.handle_bad_response(response);
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
                  body: _.escape(target.value),
                  user: this.user_logged_in.get("_id"),
                  user_wall: this.model.get("_id")
                },
                {
                wait : true,    // waits for server to respond with 200 before adding newly created model to collection
                silent: true,
                success : function(resp){
                    self.insert_needed_info_into_comments(resp);
                },
                error : function(err, resp, options) {
                    App.handle_bad_response(resp);
                }
                });
              target.value = "";
            },

            handle_interval_fetching: function(){
                this.comment_editing_no_comment_fecthing = App.GET_comment_editing_no_comment_fecthing();
            },

            fetch_comments: function(){
                var self = this;
                var user_id = this.model.get("_id");
                if(!this.user_idle && this.view_is_alive){
                    this.collection.fetch({
                    data: $.param({ user_id: user_id}),

                    update: true,

                    success: function(){
                        self.collection.trigger("reset");
                    },
                    error: function (err, resp, options) {
                        App.handle_bad_response(resp);
                    }
                    });
                }
                if(this.Interval){
                  clearInterval(this.Interval);
                  this.Interval = null;
                }
                if(!this.view_is_alive){
                    try{
                        clearInterval(this.Interval);
                    }catch(err){

                    }
                    return;
                }
                this.Interval = window.setInterval(function(){self.fetch_comments();},10000);   //Working Working Working    
            },

            fetch_sigle_comment: function(){

            },

            insert_needed_info_into_comments : function(model){
                var comment_user = model.get('user');
                if(model.get("_id") == this.sub_comment_id){
                    model.set("highlight", true);
                }
                if(model.get("parent"))return;
                if( comment_user._id == this.user_logged_in.get('_id')){
                    model.set("match", true);
                }
                model.set("user_logged_in", this.user_logged_in.toJSON());
                var comment = new Comment({model: model, collection: this.collection});
                this.childViews.push(comment);
                $("#wall", this.el).prepend(comment.el);
            },

            is_user_idle: function () {
                this.user_idle = App.user_idle;
            },

            onClose: function() {
                this.view_is_alive = false;
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
