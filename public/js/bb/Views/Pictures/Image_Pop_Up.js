define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Pictures/Album/image_pop_up.html'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template
    ) {

        var Image_Pop_Up = Marionette.View.extend({

            className: "Image_Pop_Up",

            template: Handlebars.compile(Template),

            events: {
                "click #delete_image"  :  "show_yes_no_buttons",
                "click #no_image"      :  "hide_yes_no_buttons",
                "click #yes_image"     :  "delete_image",
                "click #img_cover_check"  : "make_this_image_cover",
                "click #prev"           : "previous_image",
                "click #next"           : "next_image",
                "click #edit_image"     : "edit_image",
                "click #save_image"     : "save_image",
                "keypress .edit_content" : "press_enter"
            },

            initialize: function() {
                this.profile_in_view = App.Profile_in_View;
                this.session = App.Session;        
                this.render();
            },

            render: function() {
                this.set_match();
                console.log(this.model);
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            },

            set_match: function(){
                this.model.set("user_logged_in", this.session.toJSON());
                var match =(this.profile_in_view.get("_id") == this.session.get("_id")) ? true : false;
                this.model.set("match", match);
            },

            show_yes_no_buttons: function(){
                if(this.model.get("img_cover")){
                    var $warning = $(".alert-warning", this.el);
                    $warning.removeClass("hide");
                    setTimeout(function(){
                        $warning.addClass("hide");
                    },5000);
                    return;
                }
                $(".yes_no", this.el).removeClass("hide");
                $("#delete_image", this.el).addClass("hide");
            },

            hide_yes_no_buttons: function(){
                $(".yes_no", this.el).addClass("hide");
                $("#delete_image", this.el).removeClass("hide");
            },

            delete_image: function(){
                if(this.model.get("img_cover"))return;
                this.hide_yes_no_buttons();
                var self = this;
                this.collection.remove(this.model);
                this.model.destroy({
                    wait: true,
                    success : function(model,resp){
                        $("button.close",self.el).trigger("click");                        
                        self = null;
                    },
                    error: function(){
                        $(".panel", self.el).addClass("hide");
                        $(".alert-danger", self.el).removeClass("hide");
                        self = null;
                    }
                });
            },

            make_this_image_cover: function(e){
                if(this.model.get("img_cover"))return;
                var this_img_id = this.model.get("_id");
                var $img_cover_check = $(e.currentTarget, this.el);
                var self = this;
                this.collection.each(function(image){
                    if(image.get("img_cover") === true){
                        image.set("img_cover", false);
                        image.save();
                    }
                    if(image.get("_id")  ==  this_img_id){
                        image.set("img_cover", true);
                        $img_cover_check.addClass("green");
                        self.save_image();
                        self = null;
                    }else{
                        image.set("img_cover", false);
                    }
                });
            },

            previous_image: function(){
                console.log("previous_image");
                var this_img_id = this.model.get("_id");
                var self = this;
                this.model = null;
                this.collection.each(function(image, index){
                    if(image.get("_id")  ==  this_img_id){
                        self.model = self.collection.at(index - 1);
                        if(!self.model){
                            var length = self.collection.length;
                            self.model = self.collection.at(length-1);
                        }
                        self.render();
                    }
                });
                self = null;
            },

            next_image: function(){
                console.log("next_image");
                var this_img_id = this.model.get("_id");
                var self = this;
                this.model = null;
                this.collection.each(function(image ,index){
                    if(image.get("_id")  ==  this_img_id){
                        self.model = self.collection.at(index + 1);
                        if(!self.model){
                            self.model = self.collection.at(0);
                        }
                        self.render();
                    }
                });
                self = null;
            },

            edit_image: function(e){
                $(e.currentTarget, this.el).addClass("hide");
                $("#save_image", this.el).removeClass("hide");
                $("h4", this.el).addClass("hide");
                $(".panel", this.el).removeClass("hide");
            },

            save_image: function(){
                var self = this;
                $("#save_image", this.el).addClass("hide");
                $("#edit_image", this.el).removeClass("hide");
                $("h4", this.el).removeClass("hide");
                $(".panel", this.el).addClass("hide");
                var new_name = $("#name", this.el).html();
                var description = $("#description", this.el).html();
                this.model.set({
                    "name" : new_name,
                    "description": description
                });
                this.model.save(null,{
                    wait: true,
                    success : function(model,resp){
                        $(".panel", self.el).addClass("hide");
                        $(".alert-success", self.el).removeClass("hide");
                         setTimeout(function(){
                            self.render();
                            self = null;
                        },3000);
                    },
                    error: function(){
                        $(".panel", self.el).addClass("hide");
                        $(".alert-danger", self.el).removeClass("hide");
                        setTimeout(function(){
                            $(".alert", self.el).addClass("hide");
                            self = null;
                        },3000);
                    }
                });
            },

            press_enter: function(event){
                if (event.keyCode === 13) this.save_image();
            },

            onClose: function() {

            }
        });
        // export stuff:
        return Image_Pop_Up;
    });
