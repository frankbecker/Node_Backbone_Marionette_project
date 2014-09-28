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
                this.editing = false;
                this.childViews = [];      //GARBAGE COLLECTION
                this.user_logged_in = App.Session;
                this.new_SubComment = null;
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

            newSubComment:function(event){
              if (event.keyCode != 13) return;
                var target = event.target;
                if(target.value === ""){
                 $(this.el).find(".comment").attr('placeholder','Please try again!');
                 return;
                }
              this.new_SubComment = this.collection.create({
                  body: target.value,
                  user: this.user_logged_in.get("_id"),
                  parent: this.model.get("_id")
                },{ silent: true, wait: true, success: this.insert_needed_info_into_comments(this.new_SubComment), fail: this.created_comment_fail} );
            },

            created_comment_success : function(new_comment, response, options){
           
            },

            created_comment_fail: function(new_comment, response, options){
                console.log("something went wrong when creating a new commment");
            },

            insert_needed_info_into_comments : function(model){
                var SubComments_array = this.model.get("sub_comments");
                var comment_user = model.get('user');
                if( comment_user._id == this.user_logged_in.get('_id')){
                    model.set("match", true);
                }
                var sub_comment = new SubComment({model: model, collection: this.collection});
                $(".sub_container", self.el).append(sub_comment.el);
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
                var value = this.$el.find(".edit input").val();
                this.model.save({body: value});
                this.$el.find(".comment-content").removeClass("hide");
                this.$el.find(".edit").addClass("hide");
            },

            load_sub_comments : function(){
                var self = this;
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
