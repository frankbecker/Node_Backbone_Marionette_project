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
                "keypress .comment"            : "newSubComment",
                'click .comment-edit'          : 'edit_comment',
                'click .comment-destroy'       : 'destroy_model',
                'keypress .todo-input'         : 'update_comment'
            },

            initialize: function(){
                this.listenTo(this.model, "destroy", this.close);
                this.listenTo(this.model, "remove", this.close);
                this.listenTo(this.model, "change", this.render_template_only);
                this.listenTo(this.collection, "reset", this.load_sub_comments);
                this.editing = false;
                this.childViews = [];      //GARBAGE COLLECTION
                this.user_logged_in = App.Session;
                this.profile_in_view = App.Profile_in_View;
                this.new_SubComment = null;
                this.subComments_ids = [];
                this.render();
            },

            render: function() {
                var self = this;
                $(this.el).html(this.template(this.model.toJSON()));
                setTimeout(function(){
                    self.load_sub_comments();
                    self = null;
                }, 0);
                return this;
            },

            render_template_only : function(){
                this.$el.find(".comment-content").html(this.model.get("body"));
            },

            newSubComment:function(event){
              if (event.keyCode != 13) return;
                var target = event.target;
                if(target.value === ""){
                 $(this.el).find(".comment").attr('placeholder','Please try again!');
                 return;
                }                
                var self = this;
                this.new_SubComment = this.collection.create({
                  body: target.value,
                  user: this.user_logged_in.get("_id"),
                  parent: this.model.get("_id"),
                  user_wall: this.profile_in_view.get("_id")
                },
                {
                wait : true,    // waits for server to respond with 200 before adding newly created model to collection
                silent: true,
                success : function(resp){
                    self.append_new_subComment(resp);
                },
                error : function(err) {
                    console.log("Error creating new Subcomment");
                }
                });

                target.value = "";
            },

            created_comment_success : function(new_comment, response, options){
           
            },

            created_comment_fail: function(new_comment, response, options){
                console.log("something went wrong when creating a new commment");
            },

            append_new_subComment : function(model){
                var comment_user = model.get('user');
                if( comment_user._id == this.user_logged_in.get('_id')){
                    model.set("match", true);
                }
                var sub_comment = new SubComment({model: model, collection: this.collection});
                $(".sub_container", this.el).append(sub_comment.el);
                /// newly created subComment we need to insert the id into the array that keeps track of subcomment ids
                this.subComments_ids.push(model.get("_id"));
            },

            edit_comment: function(){
                if(!this.editing){
                    this.$el.find(".comment-content").addClass("hide");
                    this.$el.find(".edit").removeClass("hide");
                    this.editing = true;
                }else if(this.editing){
                    this.$el.find(".comment-content").removeClass("hide");
                    this.$el.find(".edit").addClass("hide");
                    this.update_comment(false, true);
                    this.editing = !this.editing;
                }
            },

            update_comment: function(event, just_update){
                if(!just_update){
                    if (event.keyCode != 13) return;
                }
                var self = this;
                var value = this.$el.find(".edit input").val();
                this.model.save({body: value}).done(function(){
                    self.$el.find(".comment-content").removeClass("hide");
                    self.$el.find(".edit").addClass("hide");              
                    self = null;
                }).fail(function(){
                    console.log("Something went wrong updating comment");
                });
            },

            load_sub_comments : function(){
                var self = this;
                var sub_comments = this.collection.where({parent: this.model.get('_id')});
                var new_comments = [];
                _.each(sub_comments, function(sub_comment_model){
                    new_comments.push(sub_comment_model.get('_id'));
                });
                var difference = _.difference(new_comments, this.subComments_ids);
                _.each(difference , function(sub_id){
                    var model = self.collection.findWhere({_id: sub_id});
                    self.add_sub_comment(model);
                });
                this.subComments_ids = new_comments;
            },

            add_sub_comment: function(sub_comment_model){
                    var comment_user = sub_comment_model.get('user');         
                    if( comment_user._id == this.user_logged_in.get('_id')){
                        sub_comment_model.set("match", true);
                    }
                    var sub_comment_view = new SubComment({model: sub_comment_model, collection: this.collection});
                    this.childViews.push(sub_comment_view);
                    $(".sub_container", this.el).append(sub_comment_view.el);
            },

            update_sub_comments: function(){
                console.log("updating SubComments");
            },

            destroy_model: function(){
                this.model.destroy();
                this.close();
            },

            onClose: function() {
                _.each(this.childViews, function(childView){
                      if (childView.close){
                        childView.close();
                      }
                });
            }
        });
        // export stuff:
        return Comment;
    });
