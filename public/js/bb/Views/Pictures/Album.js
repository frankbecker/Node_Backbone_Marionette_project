define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'bootstrap',
        'text!bb/Templates/Pictures/Album/Album.html',
        'bb/Models/Pictures/Album',
        'bb/Collections/Pictures/Images',
        'bb/Views/Pictures/Image_Thumb',
        'bb/Views/Pictures/Image_Pop_Up'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        bootstrap,
        Template,
        Album_model,
        Images,
        Image_Thumb,
        Image_Pop_Up
    ) {

        var Album = Marionette.View.extend({

            className: "Album",

            template: Handlebars.compile(Template),

            events: {
                "click #edit"  : "edit",
                "click #save"   : "save_album",
                "click #add_image": "add_image",
                "click #delete_album" : "show_pop_up",
                "click #yes"        : "delete_album",
                "click #cancel"     : "show_album_again",
                "click .save"       : "validate",
                "drop #picture" : "dropHandler",
                "dragover #picture" : "dragoverHandler",
                "click .pagination a"  : "handle_pagination",
                "click .thumb-container"  :  "show_image_pop_up"
            },
            /*
                var options = {
                    album_id : album_id,
                    user_id : user_id,
                    img_id : img_id,
                    commment_id : commment_id
                };
             */
            initialize: function(options) {
                this.profile_in_view = App.Profile_in_View;
                this.session = App.Session;
                this.album_id = options.album_id;
                this.match = ((options.user_id == this.session.get("_id")) ? true : false);
                this.model = new Album_model({ _id : options.album_id });
                this.fetch_this_model();
                this.collection = new Images();
                this.listenTo(this.collection, "add", this.add_image_to_view);
                this.listenTo(this.collection, "change", this.populate_images);
                this.listenTo(this.collection, "remove", this.populate_images);
                this.childViews = [];      //GARBAGE COLLECTION
                this.image_name = null;
                this.pictureFile = null;
                this.page = 1;
                this.image_pop_up_view = null;
                this.img_to_pop_up = options.img_id;
                this.comment_to_highlight = options.commment_id;
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
                    error: function (err, resp, options) {
                        App.handle_bad_response(resp);
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
                    self.fire_pop_up();
                    self = null;
                   },

                   error: function (err, resp, options) {
                        App.handle_bad_response(resp);
                    }
               });
            },

            populate_images: function(){
                this.close_child_views();
                var $ul = this.$el.find(".album_container ul");
                var len = this.collection.length;
                var startPos = (this.page - 1) * 6;
                var endPos = Math.min(startPos + 6, len);
                for (var i = startPos; i < endPos; i++) {
                    var image_thumb = new Image_Thumb({model : this.collection.at(i)});
                    this.childViews.push(image_thumb);
                    $ul.append(image_thumb.el);
                }
                this.populate_pagination();
            },


            populate_pagination: function(){
                var len = this.collection.length;
                var pageCount = Math.ceil(len / 6);

                var $pagination = $(".pagination", this.el);
                $pagination.html("");
                for (var i=0; i < pageCount; i++) {
                    $pagination.append("<li" + ((i + 1) === this.page ? " class='active'" : "") + "><a data-id='"+(i+1)+"'>" + (i+1) + "</a></li>");
                }
            },

            handle_pagination: function(e){
                var page_number = $(e.currentTarget, this.el).attr("data-id");
                this.page = parseInt(page_number, 10);
                this.close_child_views();
                this.populate_images();
            },

            add_image_to_view : function(image){
                var $ul = this.$el.find(".album_container ul");
                var image_thumb = new Image_Thumb({model : image});
                this.childViews.push(image_thumb);
                $ul.append(image_thumb.el);
            },

            edit: function(e){
                $(e.currentTarget, this.el).addClass("hide");
                $("#save", this.el).removeClass("hide");
                $(".edit_content", this.el).addClass("editable").attr("contenteditable", true);
            },

            fire_pop_up: function(){
                if(this.img_to_pop_up) this.show_image_pop_up(this.img_to_pop_up);
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
                        $(".panel", self.el).addClass("hide");
                        $(".alert-success", self.el).removeClass("hide");
                         setTimeout(function(){
                        $(".panel", self.el).removeClass("hide");
                        $(".alert", self.el).addClass("hide");
                        self = null;
                        },3000);
                    },
                    error: function(){
                        $(".panel", self.el).addClass("hide");
                        $(".alert-danger", self.el).removeClass("hide");
                        setTimeout(function(){
                            $(".panel", self.el).removeClass("hide");
                            $(".alert", self.el).addClass("hide");
                            self = null;
                        },3000);
                    }
                });
            },

            delete_album: function(){
                var self = this;
                $('#yes_no_modal',this.el).on('hidden.bs.modal', function (e) {
                    self.model.destroy({
                        success: function(model, response) {
                            App.Router.navigate('pictures/'+self.session.get("_id"), {
                                trigger: true
                             });
                            self = null;
                        },
                        error : function (model, response) {
                            $(".panel", self.el).addClass("hide");
                            $(".alert-danger", self.el).removeClass("hide");
                            setTimeout(function(){
                                $(".panel", self.el).removeClass("hide");
                                $(".alert", self.el).addClass("hide");
                                self = null;
                            },3000);
                        }
                    });
                });

            },

            show_pop_up:function(){
                $('#yes_no_modal',this.el).modal('show');
            },

            add_image: function(){                
                $('#album',this.el).addClass('hide');
                $('#Add_Image',this.el).removeClass('hide');
                $('#Add_Image #name',this.el).val('');
                $('#Add_Image #description',this.el).val('');
                $('#Add_Image .help-inline',this.el).html('');
            },

            show_album_again: function(){
                $('#album',this.el).removeClass('hide');
                $('#Add_Image',this.el).addClass('hide');
                this.pictureFile = null;
                $('#Add_Image #picture',this.el).attr('src', "pics/default.jpg");
                this.hideAlert();
            },

            show_image_pop_up: function(e){
                var image_id;                                    
                if(typeof e === "string"){
                    image_id = e;                    
                }else{
                    image_id = $(e.currentTarget).attr("data-id");
                }
                console.log(image_id);
                var comment_to_highlight = this.comment_to_highlight;
                this.comment_to_highlight = null;
                var $image_pop_up = $('#img_pop_up',this.el);
                var image_model = this.collection.findWhere({ "_id" : image_id });
                this.image_pop_up_view = new Image_Pop_Up({ model : image_model , collection: this.collection , comment_to_highlight : comment_to_highlight });
                $image_pop_up.find(".modal-content").append(this.image_pop_up_view.el);
                $image_pop_up.modal('show');
                var self = this;
                $image_pop_up.on('hidden.bs.modal', function (e) {
                    self.remove_image_pop_up();
                });
            },

            remove_image_pop_up : function(){
                var user_id = this.profile_in_view.get("_id");
                var album_id = this.album_id;
                App.Router.navigate("album/"+user_id+"/"+album_id, {
                    trigger: false
                });
                this.image_pop_up_view.close();
            },

            ///  +++++++++++++++++++++++++++++++++++++++++++++++++
            ///  Image upload FORM related  -----   Below
            ///  +++++++++++++++++++++++++++++++++++++++++++++++++
            change: function (event) {
                // Remove any existing alert message
                this.hideAlert();

                // Apply the change to the model
                var target = event.target;
                if(target.value == ""){
                    this.addValidationError(target.id, "Please insert value.");
                }
            },

            beforeSave: function () {
                var self = this;
                // Upload picture file if a new file was dropped in the drop area
                if (this.pictureFile) {
                    this.uploadFile(this.pictureFile,
                        function (image_name) {
                            self.image_name = image_name;
                            self.save();
                            self = null;
                        }
                    );
                } else {
                    //this.save();
                    self.showAlert('Error!', 'Please add image, just drag and drop', 'alert-danger');
                }
                return false;
            },

            save: function () {
              var self = this;
              var session_id = this.session.get("_id");
              var name = $("#Add_Image #name", this.el).val();
              var description = $("#Add_Image #description", this.el).val();
              var image_name = this.image_name;
              var album_id = this.album_id;
              this.collection.create({
                album     : album_id,
                img_name  : image_name,
                name      : name,
                description  : description,
                user      : session_id,
                img_cover : false
              },
                {
                wait : true,    // waits for server to respond with 200 before adding newly created model to collection
                success : function(resp){
                    console.log(resp);
                    self.showAlert('Success!', 'Info saved successfully', 'alert-success');
                    //App.Router.navigate('album/'+session_id+'/'+self.album_id, { trigger: true });  ////  Once we are done creating the Album lets foward the user there
                    self.show_album_again();
                    self = null;
                },
                error: function (err, resp, options) {
                    self = null;
                    App.handle_bad_response(resp);
                }
                });
            },

            dropHandler: function (event) {
                event.stopPropagation();
                event.preventDefault();
                var e = event.originalEvent;
                e.dataTransfer.dropEffect = 'copy';
                this.pictureFile = e.dataTransfer.files[0];

                // Read the image file from the local file system and display it in the img tag
                var reader = new FileReader();
                reader.onloadend = function () {
                    $('#picture',this.el).attr('src', reader.result);
                };
                reader.readAsDataURL(this.pictureFile);
            },

            dragoverHandler: function(event) {
                event.preventDefault();
            },

            displayValidationErrors: function (messages) {
                for (var key in messages) {
                    if (messages.hasOwnProperty(key)) {
                        this.addValidationError(key, messages[key]);
                    }
                }
                this.showAlert('Warning!', 'Fix validation errors and try again', 'alert-danger');
            },

            uploadFile: function (file, callbackSuccess) {
                var self = this;
                var data = new FormData();
                data.append('file', file);
                $.ajax({
                    url: 'upload_img',
                    type: 'POST',
                    data: data,
                    processData: false,
                    cache: false,
                    contentType: false
                })
                .done(function (data, textStatus, jqXHR) {
                    callbackSuccess(data);
                })
                .fail(function () {
                    self.showAlert('Error!', 'An error occurred while uploading ' + file.name, 'alert-danger');
                });
            },

            addValidationError: function (field, message) {
                var controlGroup = $('#Add_Image #' + field).parent().parent();
                controlGroup.addClass('error');
                $('.help-inline', controlGroup).html(message);
            },

            removeValidationError: function (field) {
                var controlGroup = $('#Add_Image #' + field).parent().parent();
                controlGroup.removeClass('error');
                $('.help-inline', controlGroup).html('');
            },

            showAlert: function(title, text, klass) {
                $('#img_alert .alert').removeClass("alert-error alert-warning alert-success alert-info");
                $('#img_alert .alert').addClass(klass);
                $('#img_alert .alert').html('<strong>' + title + '</strong> ' + text);
                $('#img_alert .alert').show();
            },

            hideAlert: function() {
                $('#img_alert .alert').hide();
            },

            validate: function () {
                if( $("#Add_Image #name", this.el).val() == "" ){
                    this.addValidationError("name", "Please insert value.");
                    return;
                }
                this.beforeSave();
            },

            close_child_views: function(){
                _.each(this.childViews, function(childView){
                      if (childView.close){
                        childView.close();
                      }
                });
            },

            onClose: function() {
                if(this.image_pop_up_view) this.image_pop_up_view.close();
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
