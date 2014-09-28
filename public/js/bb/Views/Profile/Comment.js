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
              var self = this;
              var SubComments_array = this.model.get("sub_comments");
              var new_model = {
                  body: target.value,
                  index: SubComments_array.length,
                  user: this.user_logged_in.get('_id'),
                  match: true
                };
              
              SubComments_array.push(new_model);
              /// this is just so that it will conform with the template              
              this.model.set("sub_comments" , SubComments_array);
              console.log(this.model.toJSON());
              var user = this.model.get("user");
              this.model.set("user", user._id);
              this.model.save().done(function(){
                  new_model.user = self.user_logged_in.toJSON();
                  var MyModel = Backbone.Model.extend({});
                  var model = new MyModel(new_model);
                  var subcomment = new SubComment({model: model});
                  subcomment.on("sub_comment:edit",function(id){
                    self.update_subcomment(id);
                  });
                  self.childViews.push(subcomment);
                  $(".sub_container", self.el).append(subcomment.el);
              });
             
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
                this.model.save({comment: value});
                this.$el.find(".comment-content").removeClass("hide");
                this.$el.find(".edit").addClass("hide");
            },

            load_sub_comments : function(){
                var self = this;
                var SubComments_array = this.model.get("sub_comments");
                _.each(SubComments_array, function(subcomment){
                  var MyModel = Backbone.Model.extend({});
                  var comment_user = subcomment.user;
                    if( comment_user._id == this.user_logged_in.get('_id')){
                        subcomment.match = true;
                    }
                  var model = new MyModel(subcomment);
                  var subcomment_view = new SubComment({model: model});
                  subcomment_view.on("sub_comment:edit",function(id){
                    self.update_subcomment(id);
                  });
                  self.childViews.push(subcomment_view);
                  $(".sub_container", self.el).append(subcomment_view.el);
                });
            },

            update_subcomment: function(index_id){
                console.log("SubComment has been updated");
                console.log(index_id);
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
