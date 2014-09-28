define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Profile/sub_comment.html'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template
    ){

        var SubComment = Marionette.View.extend({

            className: "SubComment",

            template: Handlebars.compile(Template),

            events: {
              'keypress .todo-input'            : 'update_comment',
              "blur .todo-input"                : "hide_input",
              'click .sub_comment-edit'         : 'edit_comment',
              'click .sub_comment-destroy'      : 'destroy_model',
            },

            initialize: function() {
                this.render();
            },

            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            },

            edit_comment: function(){
                if(!this.editing){
                    this.$el.find(".sub_comment-content").addClass("hide");
                    this.$el.find(".edit-sub").removeClass("hide");
                    this.editing = true;
                }else if(this.editing){
                    this.$el.find(".sub_comment-content").removeClass("hide");
                    this.$el.find(".edit-sub").addClass("hide");
                    this.update_comment(false, true);
                    this.editing = !this.editing;
                }      
            },

            update_comment: function(event, just_update){
                if(!just_update){
                    if (event.keyCode != 13) return;
                }
               
                var value = this.$el.find(".edit-sub input").val();
                this.model.save({body: value});
                var subcomment_index = this.$el.find(".media").attr("data-index");
                this.trigger("sub_comment:edit" , subcomment_index);
                this.$el.find(".sub_comment-content").removeClass("hide");
                this.$el.find(".edit-sub").addClass("hide");
            },

            hide_input:function(){
                this.$el.removeClass("show_inputbox-sub");
            },

            destroy_model: function(){
                this.model.destroy();
                this.close();
            },

            onClose: function() {

            }
        });
        // export stuff:
        return SubComment;
    });
