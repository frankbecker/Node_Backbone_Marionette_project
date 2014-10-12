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
                this.listenTo(this.model, "change", this.update_only_comment);
                this.listenTo(this.model, "remove", this._close);
                this.listenTo(this.model, "destroy", this._close);
                this.render();
            },

            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                var self = this;
                setTimeout(function(){
                    self.highlight();
                    self = null;
                },0);
                return this;
            },

            highlight: function(){
                if(this.model.get("highlight") == true){
                    $(this.el).addClass("highlight");
                }
            },

            update_only_comment: function (){
                this.$el.find(".sub_comment-content").html(this.model.get('body'));
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
                var self = this;
                var value = this.$el.find(".edit-sub input").val();
                this.model.save({body: value}).done(function(){
                self.$el.find(".sub_comment-content").removeClass("hide");
                self.$el.find(".edit-sub").addClass("hide");
                self = null;
                }).fail(function(){
                    console.log("error updating subcomment");
                });
            },

            hide_input:function(){
                this.$el.removeClass("show_inputbox-sub");
            },

            destroy_model: function(){
                this.model.destroy();
            },

            onClose: function() {

            },

            _close: function(){
                var self = this;
                $(this.el).fadeOut( 700,function() {
                    self.close();
                    self = null;
                });
            }
        });
        // export stuff:
        return SubComment;
    });
