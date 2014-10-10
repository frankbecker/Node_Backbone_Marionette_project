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
                "click .glyphicon-remove-circle" : "close"
            },

            initialize: function() {
                //this.listenTo(this.model, "change", this.render);
                this.render();
            },

            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            },

            minimize: function(){
                $(this.el).toggleClass( "minimize" );
            },

            onClose: function() {
                console.log("closing this box");
            }
        });
        // export stuff:
        return ChatBox;
    });
