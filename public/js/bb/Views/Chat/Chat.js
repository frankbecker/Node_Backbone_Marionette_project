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
                
            },

            initialize: function() {
                this.collection = App.Friends;
                this.listenTo(this.collection, "fetched", this.populate_chat_memebers);
                this.childViews = [];      //GARBAGE COLLECTION
                this.chat_built = false;
                this.render();
            },
 
            render: function() {
                $(this.el).html(this.template());
                var self = this;
                setTimeout(function(){
                    self.populate_chat_memebers();
                },0);
                return this;
            },

            populate_chat_memebers: function(){
                var $ul = $("#user_list", this.el);
                var self = this;
                if(this.chat_built)return;
                    self.collection.each(function (member) {
                        self.chat_built = true;
                        if(!member.get("first_name"))return;
                        var member_view = new Member({ model: member });
                        self.childViews.push(member_view);
                        $ul.append(member_view.el);
                    });
                    self = null;
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
