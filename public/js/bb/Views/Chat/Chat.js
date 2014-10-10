define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Chat/Chat.html',
        'bb/Views/Chat/Member',
        'bb/Views/Chat/ChatBox'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template,
        Member,
        ChatBox
    ) {

        var Chat = Marionette.View.extend({

            className: "Chat",

            template: Handlebars.compile(Template),

            events: {
                "click li"  : "open_chat_box"
            },

            initialize: function() {
                this.collection = App.Friends;
                this.listenTo(this.collection, "fetched", this.populate_chat_members);
                this.childViews = [];      //GARBAGE COLLECTION
                this.chat_built = false;
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
                        var member_view = new Member({ model: member });
                        self.childViews.push(member_view);
                        $ul.append(member_view.el);
                    });
                    self = null;
            },

            open_chat_box: function (e) {
                var id = $("b",e.currentTarget).attr("id");
                var user = this.collection.findWhere({_id : id});
                var chat_box = new ChatBox({ model: user });
                this.childViews.push(chat_box);
                $("#chat_boxes").prepend(chat_box.el);
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
        return Chat;
    });
