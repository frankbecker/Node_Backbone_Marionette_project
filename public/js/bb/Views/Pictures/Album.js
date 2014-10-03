define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Pictures/Album/Album.html',
        'bb/Models/Pictures/Album',
        'bb/Collections/Pictures/Images',
        'bb/Views/Pictures/Image_Thumb'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template,
        Album_model,
        Images,
        Image_Thumb
    ) {

        var Album = Marionette.View.extend({

            className: "Album",

            template: Handlebars.compile(Template),

            events: {
                "click #edit"  : "edit",
                "click #save"   : "save_album",
                "click #add_image": "add_image",
                "click #delete_album" : "delete_album"
            },
            /*
                options = {_id}
             */
            initialize: function(options) {
                this.profile_in_view = App.Profile_in_View;
                this.profile_logged_in = App.Session;
                this.match = ((this.profile_in_view.get("_id") == this.profile_logged_in.get("_id")) ? true : false);
                this.model = new Album_model({ _id : options._id });
                this.fetch_this_model();
                this.collection = new Images();
                this.childViews = [];      //GARBAGE COLLECTION
            },

            render: function() {
                //  I created a new render function, because I want this view to render after the fetch has been complete
                //  I should probably add a back up in case something goes wrong with the fetch, just to show the user that something went wrong 
                return this;
            },

            fetch_this_model: function(){
                var self = this;
                this.model.fetch({

                   success:function(model, response, options){
                    self.my_own_render();
                    self = null;
                   },

                   fail:function(model, response, options){
                    console.log("Failure to fetch album model");
                   }
               });
            },

            my_own_render : function(){
                $(this.el).html(this.template(this.model.toJSON()));
                this.fetch_image_collection();
                if(this.match){
                    this.add_buttons();
                }
            },

            add_buttons: function(){
                var btn_html = "<button id='add_image' type='button' class='btn btn-primary'><span class='glyphicon glyphicon-plus'></span>Add Image</button>";
                btn_html += "<button id='delete_album' type='button' class='btn btn-danger'>Delete Album</button>";
                btn_html += "<button id='edit' type='button' class='btn btn-info'>Edit</button>";
                btn_html += "<button id='save' type='button' class='btn btn-success hide'>Save</button>";
                
                $(".header_container", this.el).append(btn_html);
            },

            fetch_image_collection: function(){
                var self = this;
                var album_id = this.model.get("_id");
                this.collection.fetch({

                   data: $.param({ album_id: album_id }),

                   silent: true,

                   success:function(collection, response, options){
                    self.populate_images();
                    self = null;
                   },

                   fail:function(collection, response, options){
                    console.log("Falied to retrieve images for album");
                   }
               });
            },

            populate_images: function(){
                var self = this;
                var $ul = this.$el.find(".album_container ul");
                this.collection.each(function(image){
                    var image_thumb = new Image_Thumb({model : image});
                    self.childViews.push(image_thumb);
                    $ul.append(image_thumb.el);
                });
                self = null;
            },

            edit: function(e){
                $(e.currentTarget, this.el).addClass("hide");
                $("#save", this.el).removeClass("hide");
                $(".edit_content", this.el).addClass("editable").attr("contenteditable", true);
            },


            save_album: function(e){
                $(e.currentTarget, this.el).addClass("hide");
                $("#edit", this.el).removeClass("hide");
                $(".edit_content", this.el).removeClass("editable").attr("contenteditable", false);
                var name = $("#name", this.el).html();
                var description = $("#description", this.el).html();
                this.model.set("name", name);
                this.model.set("description", description);
                var img_cover = this.model.get("img_cover");
                this.model.set("img_cover", img_cover._id);  /// we need to put back the id instead of the object when updating the DB
                var self = this;
                this.model.save(null,{
                    wait: true,
                    success : function(model,resp){
                        $(".alert-success", self.el).removeClass("hide");
                         setTimeout(function(){
                        $(".alert", self.el).addClass("hide");
                        self = null;
                        },3000);
                    },
                    error: function(){
                        $(".alert-danger", self.el).removeClass("hide");
                        setTimeout(function(){
                            $(".alert", self.el).addClass("hide");
                            self = null;
                        },3000);
                    }
                });
            },

            delete_album: function(){
                var self = this;
                this.model.destroy({
                    success: function(model, response) {
                        App.Router.navigate('pictures/'+self.profile_logged_in.get("_id"), {
                            trigger: true
                         });
                        self = null;
                    },
                    fail : function (model, response) {
                        $(".alert-danger", self.el).removeClass("hide");
                        setTimeout(function(){
                            $(".alert", self.el).addClass("hide");
                            self = null;
                        },3000);
                    }
                });
            },

            add_image: function(){

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
        return Album;
    });
