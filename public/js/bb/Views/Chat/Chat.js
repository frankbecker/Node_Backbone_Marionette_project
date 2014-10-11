define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Chat/Chat.html',
        'bb/Views/Chat/Member'        
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template,
        Member
    ) {

        var Chat = Marionette.View.extend({

            className: "Chat",

            template: Handlebars.compile(Template),

            events: {
                "click #chat_button" : "open_chat",
                "click #close" : "close_chat"
            },

            initialize: function() {
                this.session = App.Session;
                this.collection = App.Friends;
                this.listenTo(this.collection, "fetched", this.populate_chat_members);
                this.childViews = [];      //GARBAGE COLLECTION
                this.chat_built = false;
                this.socket = App.io;
                this.bind_socket_io();
                this.chat_add_user();
                this.users_online = [];
                this.counter = 0;
                this.chat_open = false;
                this.render();
            },
 
            render: function() {
                $(this.el).html(this.template());
                var self = this;
                setTimeout(function(){
                    self.populate_chat_members();
                },0);
                return this;
            },

            populate_chat_members: function(){
                var $ul = $("#user_list", this.el);
                var self = this;
                $ul.html("");
                    self.collection.each(function (member) {
                        self.chat_built = true;
                        if(!member.get("first_name"))return;
                        if(_.indexOf(self.users_online , member.get('_id')) !== -1){
                            member.set("online", true);
                        }
                        var member_view = new Member({ model: member, socket: self.socket});
                        self.childViews.push(member_view);
                        $ul.append(member_view.el);
                    });
                    self = null;
            },

            chat_add_user: function () {
                var user_id = this.session.get('_id');
                this.socket.emit('add user', {
                  _id: user_id
                });
            },

            bind_socket_io: function(){
                var self = this;
                this.socket.removeAllListeners();

                // Whenever the server emits 'new message', update the chat body
                this.socket.on('new message', function (data) {
                    self.new_message(data);
                });

                // Whenever the server emits 'user joined', log it in the chat body
                this.socket.on('user joined', function (data) {
                    self.user_joined(data);
                });

                // Whenever the server emits 'user left', log it in the chat body
                this.socket.on('user left', function (data) {
                     self.user_left(data);
                });

                // Whenever the server emits 'typing', show the typing message
                this.socket.on('typing', function (data) {
                    self.user_typing(data);
                });

                // Whenever the server emits 'stop typing', show the typing message
                this.socket.on('stop typing', function (data) {
                    self.user_stop_typing(data);
                });


            },

            user_joined: function (array_of_users_online) {  // _id index
                this.users_online = array_of_users_online;
                console.log("users online");
                console.log(this.users_online);
                var self = this;
                _.each(this.users_online, function (user_id) {
                    var friend = self.collection.findWhere({"_id" : user_id});
                    if(friend){
                        friend.set("online", true);
                    }
                });
                self = null;
            },

            user_left: function (data) {
                var user_id = data.user_id;
                var friend = this.collection.findWhere({"_id" : user_id});
                if(friend){
                    friend.set("online", false);
                }
                var index = this.users_online.indexOf(user_id);
                if (index > -1) {
                    this.users_online.splice(index, 1);
                }
            },

            user_typing: function (data) {
                var user_id = data.user_id;
                var friend = this.collection.findWhere({"_id" : user_id});
                if(friend){
                    friend.set("typing", true);
                }
            },

            user_stop_typing: function (data) {
                var user_id = data.user_id;
                var friend = this.collection.findWhere({"_id" : user_id});
                if(friend){
                    friend.set("typing", false);
                }
            },

            new_message: function (data) {
                this.counter++;
                this.show_counter();
               _.each(this.childViews, function(childView){
                    var user_id = childView.model.get("_id");
                    if(data.from == user_id){
                        if(childView.add_message){
                            childView.add_message(data.message);
                        }
                    }
                });
            },

            open_chat: function(){
                this.chat_open = true;
                $("#chat_region").removeClass("chat_closed");
            },

            close_chat: function(){
                this.chat_open = false;
                $("#chat_region").addClass("chat_closed");
                this.counter = 0;
                this.show_counter();
            },

            show_counter: function (argument) {
                if( this.counter !== 0 ){
                    this.$el.find("#chat_button .badge").html(this.counter).addClass("highlight");
                }else{
                    this.$el.find("#chat_button .badge").html(this.counter).removeClass("highlight");
                }
            },

            onClose: function() {
                var user_id = this.session.get('_id');
                this.socket.emit("user left", {
                  _id: user_id
                });
                //this.socket.disconnect();
                console.log("closing chat view");
                _.each(this.childViews, function(childView){
                      if (childView.close){
                        childView.close();
                      }
                });
            }
        });
        // export stuff:
        return Chat;
    });
