define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'text!bb/Templates/About/About.html'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Template
    ) {

    About = Backbone.View.extend({

        className: "About",

        template: Handlebars.compile(Template),

        events: {
            "change"        : "change",
            "click .save"   : "beforeSave",
            "click .delete" : "delete",
            "drop #picture" : "dropHandler",
            "dragover #picture" : "dragoverHandler"
        },

        initialize: function () {
            this.model = App.Profile_in_View;
            this.session = App.Session;
            this.set_match();
        },

        render: function () {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },

        set_match: function(){
            var match =(this.model.get("_id") == this.session.get("_id")) ? true : false;
            this.model.set("match", match);
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
                        self.model.set("profile_pic", image_name);
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
            console.log('before save');
            this.model.set("update_notif" , false);
            this.model.save(null, {
                success: function (model) {
                    App.Session.set("profile_pic", model.get("profile_pic"));
                    App.Session.save_session(model.toJSON(), null);  /// this is a little hack, I should have a better design for this
                    App.Session.trigger("change");
                    App.Profile_in_View.trigger("change");
                    self.render();
                    self.showAlert('Success!', 'Info saved successfully', 'alert-success');
                },
                error: function () {
                    self.showAlert('Error', 'An error occurred while trying to save this user', 'alert-error');
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
                $('#picture').attr('src', reader.result);
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
            this.showAlert('Warning!', 'Fix validation errors and try again', 'alert-warning');
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
                self.showAlert('Error!', 'An error occurred while uploading ' + file.name, 'alert-error');
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

        onClose: function(){
            
        }

    });
        // export stuff:
        return About;
    });
