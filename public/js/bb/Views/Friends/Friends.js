define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Friends/Friends.html',
        'bb/Collections/Profiles/Profiles',
        'bb/Views/Friends/Friend'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template,
        Profiles,
        Friend
    ) {

        var Friends = Marionette.View.extend({

            className: "Friends",

            template: Handlebars.compile(Template),

            events: {
                "keyup input"  : "search_for_friend",
                "click button"    : "search_for_friend_button"
            },

            initialize: function() {
                this.collection = new Profiles();
                this.profile_in_view = App.Profile_in_View;
                this.childViews = [];      //GARBAGE COLLECTION
                this.fetch_collection();
            },

            render: function() {
                $(this.el).html(this.template());
                return this;
            },

            fetch_collection: function(){
                var self = this;
                var profile_in_view_id = this.profile_in_view.get("_id");
                this.collection.fetch({

                   data: $.param({ user_id: profile_in_view_id}),

                   silent: true,

                   success:function(collection, response, options){
                    self.display_list_of_friends();
                    self = null;
                   },

                   fail:function(collection, response, options){

                   }
               });
            },

            display_list_of_friends : function(){
                var self = this;
                this.collection.each(function(friend){
                    if(!friend.get("first_name"))return;
                    self.show_friends(friend);
                });
                self = null;
            },

            search_for_friend: function(e){
                var target = event.target;
                if(target.value === ""){
                    this.onClose();
                    this.display_list_of_friends();
                 return;
                }
                var self = this;
                this.onClose();
                var input_string = target.value.toLowerCase();
                this.collection.each(function(friend){
                    var first_name = friend.get("first_name");
                    if(!first_name)return;
                    var last_name = friend.get("last_name");
                    first_name = first_name.toLowerCase();
                    last_name = last_name.toLowerCase();
                    if(first_name.charAt(0) == input_string.charAt(0) || last_name.charAt(0) == input_string.charAt(0)){
                        if(input_string.length == 1){
                            self.show_friends(friend);
                        }
                    }
                    if((first_name.indexOf(input_string) > -1) || (last_name.indexOf(input_string) > -1)){
                        if(input_string.length > 1){
                            self.show_friends(friend);
                        }
                    }
                });
                self = null;

            },

            search_for_friend_button: function(){
                $("inupt", this.el).trigger("keypress");
            },

            show_friends: function(friend){
                var friend_view = new Friend({ model : friend});
                this.childViews.push(friend_view);
                $("#friends_container ul", this.el).append(friend_view.el);
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
        return Friends;
    });
