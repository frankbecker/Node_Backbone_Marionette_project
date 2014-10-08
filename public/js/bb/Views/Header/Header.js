define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Header/Header.html',
        'bb/Collections/Profiles/Notifications',
        'bb/Views/Header/Notification'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template,
        Notifications,
        Notification
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
                this.front_end_collection = new Notifications();  /// I use this collection just to compare with the one coming in
                this.listenTo(this.front_end_collection, "add", this.populate_notifications);
                this.listenTo(App, "user_idle", this.is_user_idle);
                this.user_idle = false;
                this.Interval = null;
                this.view_is_alive = true;
                this.fetch_notifications();
                this.childViews = [];      //GARBAGE COLLECTION
                this.warning_is_up = false;
                self.collec_legth = 0;
                this.listenTo(this.model, "change:profile_pic", this.render);
                this.listenTo(this.model, "change:full_name", this.render);

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
                    App.Session.save_session(model.toJSON(), null);
                },
                error: function (err, resp, options) {
                    App.handle_bad_response(resp);
                }
                });
            },

            fetch_notifications: function(){
                var self = this;
                var param = {
                    user_id : this.model.get("_id"),
                    notif_time: this.model.get("notif_last_checked")
                };
                if(!this.user_idle){
                    this.collection.fetch({

                       data: decodeURIComponent($.param(param)),

                       silent: true,

                       update: true,

                       success:function(collection, response, options){
                        $(".badge", self.el).html(self.collection.length);
                        if(self.collection.length === 0){
                           $(".badge", self.el).addClass("no_opacity");
                           self.add_no_notification_warning();
                        }else{
                           $(".badge", self.el).removeClass("no_opacity");
                           self.remove_no_notification_warning();
                        }
                        self.after_fetch();
                       },
                       
                        error: function (err, resp, options) {
                            App.handle_bad_response(resp);
                        }
                   });
                }

                if(this.Interval){
                  clearInterval(this.Interval);
                  this.Interval = null;
                }
                if(!this.view_is_alive){
                    try{
                        clearInterval(this.Interval);
                    }catch(err){

                    }
                    return;
                }
                this.Interval = window.setInterval(function(){self.fetch_notifications();},10000);   //Working Working Working  
            },

            after_fetch: function() {
                var self = this;
                  this.collection.each(function (model) {
                    var found = self.front_end_collection.findWhere( {"_id" : model._id });
                    if(!found){
                        self.front_end_collection.push(model);
                    }
                  });
            },

            populate_notifications : function(notif){
                var notif_view = new Notification({ model : notif });
                this.childViews.push(notif_view);
                $("#dropdown", this.el).prepend(notif_view.el);
            },

            add_no_notification_warning: function() {
                $("#dropdown .to_remove", this.el).remove();
                $("#dropdown", this.el).append("<li class='to_remove divider'></li><li class='warning to_remove'><b>No Notifications at this time</b></li>");
                this.warning_is_up = true;
            },

            remove_no_notification_warning: function() {
                console.log("removing to_remove");
                $(".to_remove", this.el).addClass("hide");
                this.warning_is_up = false;
            },

            is_user_idle: function () {
                this.user_idle = App.user_idle;
            },

            onClose: function() {
                this.view_is_alive = false;
               if(this.Interval){
                  clearInterval(this.Interval);
                  this.Interval = null;
                }
                _.each(this.childViews, function(childView){
                      if (childView.close){
                        childView.close();
                      }
                });
            }
        });
        // export stuff:
        return Header;
    });
