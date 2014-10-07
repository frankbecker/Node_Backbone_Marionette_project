define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Header/Header.html',
        'bb/Collections/Profiles/Notifications'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template,
        Notifications
    ) {

        var Header = Marionette.View.extend({

            className: "Header",

            template: Handlebars.compile(Template),

            events: {
                "click #notification" : "update_notification"
            },

            initialize: function() {
                this.model = App.Session;
                this.collection = new Notifications();
                this.listenTo(this.model, "change:profile_pic", this.render);
            },

            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            },

            update_notification : function(e){
                if($(".navbar-right").hasClass("open"))return;
                this.model.set("update_notif" , true);
                this.model.save(null, {
                success: function (model) {
                    console.log(model);
                },
                error: function () {
                    console.log("Could not update notification");
                }
                });
            },

            fetch_notifications: function(){
                var self = this;
                var param = {
                    user_id : this.model.get("_id"),
                    notif_time: this.model.get("notif_last_checked")
                };
                this.collection.fetch({

                   data: $.param(param),

                   silent: true,

                   success:function(collection, response, options){
                    self.collection.each(function(model){
                        self.populate_notifications(model);
                    });
                   },

                   error:function(collection, response, options){
                    console.log("Something went wrong when fetching for comments");
                   }
               });
            },

            populate_notifications : function(notif){

            },

            onClose: function() {

            }
        });
        // export stuff:
        return Header;
    });
