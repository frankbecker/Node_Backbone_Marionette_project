define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Pictures/Album/create_album.html',
        'bb/Models/Pictures/Album',
        'bb/Collections/Pictures/Albums'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template,
        Album,
        Albums
    ) {

        var Create_Album = Marionette.View.extend({

            className: "Create_Album",

            template: Handlebars.compile(Template),

            events: {
                "click #cancel" : "cancel_album_creation",
                "change"        : "change",
                "click .save"   : "beforeSave",
                //"click .delete" : "delete",
                "drop #picture" : "dropHandler",
                "dragover #picture" : "dragoverHandler"
            },

            initialize: function() {
                this.collection = new Albums();
                this.model = new Album();
                this.session = App.Session;
            },

            render: function() {
                $(this.el).html(this.template());
                return this;
            },

            cancel_album_creation: function(){
                //App.Router.back(true);   /// this will go back to our previous route and it will trigger the proper route function
                App.Router.navigate('pictures/'+this.session.get("_id"), {
                    trigger: true
                 });
            },

            change: function (event) {
                // Remove any existing alert message
                this.hideAlert();

                // Apply the change to the model
                var target = event.target;
                var change = {};
                change[target.id] = target.value;
                this.model.set(change);

                // Run validation rule (if any) on changed item
                var check = this.model.validateItem(target.id);
                if (check.isValid === false) {
                    this.addValidationError(target.id, check.message);
                } else {
                    this.removeValidationError(target.id);
                }
            },

            beforeSave: function () {
                var self = this;
                var check = this.model.validateAll();
                if (check.isValid === false) {
                    this.displayValidationErrors(check.messages);
                    return false;
                }
                // Upload picture file if a new file was dropped in the drop area
                if (this.pictureFile) {                
                    this.uploadFile(this.pictureFile,
                        function (image_name) {
                            self.model.set("img_cover", image_name);
                            self.save();
                        }
                    );
                } else {
                    this.save();
                }
                return false;
            },

            save: function () {
              var self = this;
              var session_id = this.session.get("_id");
              this.model.set("user", session_id );
              this.new_album = this.collection.create(this.model.toJSON(),
                {
                wait : true,    // waits for server to respond with 200 before adding newly created model to collection
                silent: true,
                success : function(resp){
                    console.log(resp);
                    self.showAlert('Success!', 'Info saved successfully', 'alert-success');
                    App.Router.navigate('album/'+session_id+'/'+resp.get("_id"), { trigger: true });  ////  Once we are done creating the Album lets foward the user there
                    self = null;
                },
                error: function (err, resp, options) {
                    self = null;
                    App.handle_bad_response(resp);
                }
                });
            },

            delete: function () {
                this.model.destroy({
                    success: function () {
                        alert('User deleted successfully');
                        window.history.back();
                    }
                });
                return false;
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
                    console.log(data);
                    callbackSuccess(data);
                })
                .fail(function () {
                    self.showAlert('Error!', 'An error occurred while uploading ' + file.name, 'alert-danger');
                });
            },

            addValidationError: function (field, message) {
                var controlGroup = $('#' + field).parent().parent();
                controlGroup.addClass('error');
                $('.help-inline', controlGroup).html(message);
            },

            removeValidationError: function (field) {
                var controlGroup = $('#' + field).parent().parent();
                controlGroup.removeClass('error');
                $('.help-inline', controlGroup).html('');
            },

            showAlert: function(title, text, klass) {
                $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
                $('.alert').addClass(klass);
                $('.alert').html('<strong>' + title + '</strong> ' + text);
                $('.alert').show();
            },

            hideAlert: function() {
                $('.alert').hide();
            },

            onClose: function() {
                this.session = null;
            }
        });
        // export stuff:
        return Create_Album;
    });
