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
                "click .glyphicon-remove-circle" : "close",
                'keypress input'         : 'insert_my_message'
            },

            initialize: function() {
                //this.listenTo(this.model, "change", this.render);
                this.session = App.Session;
                this.render();
            },

            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            },

            minimize: function(){
                $(this.el).toggleClass( "minimize" );
            },

            insert_my_message: function(event){
                if (event.keyCode != 13) return;
                var value = this.$el.find("input").val();
                $(".chat_container", this.el).append("<span class='message me'><b>Me:</b>"+value+"</span>");
                this.$el.find("input").val("");
            },

            onClose: function() {
                console.log("closing this box");
            }
        });
        // export stuff:
        return ChatBox;
    });
