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
                this.Interval = null;
                this.view_is_alive = true;
                this.fetch_notifications();
                this.childViews = [];      //GARBAGE COLLECTION
                this.warning_is_up = false;
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
                    App.Session.save_session(model.toJSON(), null);
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

                   data: decodeURIComponent($.param(param)),

                   silent: true,

                   success:function(collection, response, options){
                    $(".badge", self.el).html(self.collection.length);
                    if(self.collection.length === 0){
                       $(".badge", self.el).addClass("no_opacity");
                       self.add_no_notification_warning();
                    }else{
                       $(".badge", self.el).removeClass("no_opacity");
                       self.remove_no_notification_warning();
                    }
                    self.collection.each(function(model){
                        self.populate_notifications(model);
                    });
                   },

                   error:function(collection, response, options){
                    console.log("Something went wrong when fetching for comments");
                   }
               });

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

            populate_notifications : function(notif){
                var notif_view = new Notification({ model : notif });
                this.childViews.push(notif_view);
                $("#dropdown", this.el).append(notif_view.el);
            },

            add_no_notification_warning: function() {
                if(this.warning_is_up)return;
                if($('#dropdown .to_remove').length){
                    $('#dropdown .to_remove', this.el).removeClass('hide');
                }else{
                    $("#dropdown", this.el).append("<li class='to_remove divider'></li><li class='warning to_remove'><b>No Notifications at this time</b></li>");
                }
                this.warning_is_up = true;
            },

            remove_no_notification_warning: function() {
                console.log("removing to_remove");
                $(".to_remove", this.el).addClass("hide");
                this.warning_is_up = false;
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
