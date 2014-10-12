define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Chat/chat_box.html'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template
    ) {

        var ChatBox = Marionette.View.extend({

            className: "ChatBox",

            template: Handlebars.compile(Template),

            events: {
                "click .glyphicon-minus" : "minimize",
                "click .glyphicon-remove-circle" : "hide",
                'keypress input'         : 'insert_my_message'
            },

            initialize: function(options) {
                this.listenTo(this.model, "change:typing", this.typing);
                this.session = App.Session;
                this.socket = options.socket;
                this.minimized = false;
                this.render();
            },

            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            },

            minimize: function(){
                $(this.el).toggleClass( "minimize" );
                this.minimized = !this.minimized;
                if(!this.minimized){
                    $(".header",this.el).removeClass("highlight");
                }
            },

            insert_my_message: function(event){
                var user_id = this.session.get("_id");
                var to_id = this.model.get("_id");
                  if (!this.typing) {
                    this.typing = true;
                    this.socket.emit('typing', {
                      _id: user_id
                    });
                  }
                  var self = this;
                  this.lastTypingTime = (new Date()).getTime();

                  setTimeout(function () {
                    var typingTimer = (new Date()).getTime();
                    var timeDiff = typingTimer - self.lastTypingTime;
                    if (timeDiff >= 400 && self.typing) {
                      self.socket.emit('stop typing');
                      self.typing = false;
                    }
                  }, 400);

                if (event.keyCode != 13) return;
                var value = this.$el.find("input").val();
                if(value == "") return;
                $(".chat_container", this.el).append("<span class='message me'><b>Me:</b>"+value+"</span>");
                this.$el.find("input").val("");
                this.socket.emit("new message",{
                        from_id : user_id,
                        to_id : to_id,
                        message : value
                });
                $(".chat_container", this.el).animate({ scrollTop: $(".chat_container", this.el).height() }, 0);  /// scroll to bottom with every new message
            },

            add_message: function (message) {
                var first_name = this.model.get("first_name");
                $(".chat_container", this.el).append("<span class='message'><b>"+first_name+":</b><span class='is_typing'>"+message+"</span></span>");
                if(this.minimized){
                    $(".header",this.el).addClass("highlight");
                }
                $(".chat_container", this.el).animate({ scrollTop: $(".chat_container", this.el).height() }, 0);  /// scroll to bottom with every new message
            },

            typing: function () {
                var is_user_typing = this.model.get("typing");
                var first_name = this.model.get("first_name");
                if(is_user_typing){
                    $(".chat_container", this.el).append("<span class='message typing'><b>"+first_name+":</b><span class='is_typing'>...</span></span>");
                }else{
                    $(".typing", this.el).remove();
                }
            },

            hide: function  () {
              this.minimized = false;
              $(".header",this.el).removeClass("highlight");
              $(this.el).removeClass( "minimize" );
              this.$el.addClass("hide");
              this.trigger("hide");
            },

            show: function  () {
              this.$el.removeClass("hide");
            },

            onClose: function() {
                
            }
        });
        // export stuff:
        return ChatBox;
    });
