define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Chat/member.html',
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
        ChatBox
    ) {

        var Member = Marionette.View.extend({

            className: "Member",

            tagName: 'li',

            template: Handlebars.compile(Template),

            events: {
                "click"  : 'reset_counter'
            },

            initialize: function(options) {
                this.listenTo(this.model, "change", this.render);
                this.socket = options.socket;
                this.counter = 0;
                this.chat_box = null;                
                this.chat_box_opened = false;
                this.messages = [];
                this.render();
            },

            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                this.show_counter();
                return this;
            },

            add_message: function (message) {
                this.counter++;
                this.show_counter();
                if(this.chat_box){
                    this.chat_box.add_message(message);
                }else{
                    this.messages.push(message);
                }
            },

            reset_counter: function () {
                this.counter = 0;
                this.show_counter();
                if(!this.chat_box_opened){
                    if(!this.chat_box){
                        this.open_chat_box();
                        return;
                    }
                    this.show_chat_box();
                }else{
                    this.hide_chat_box();
                }
            },

            open_chat_box: function (e) {
                this.chat_box = new ChatBox({ model: this.model , socket: this.socket});
                this.listenTo(this.chat_box, "hide", this.set_chat_box_opened_false);
                $("#chat_boxes").prepend(this.chat_box.el);
                if(this.messages.length !== 0){
                    var self = this;
                    _.each(this.messages, function(message){
                        self.chat_box.add_message(message);
                    });
                    self = null;
                }
                this.chat_box_opened = true;
            },

            hide_chat_box: function () {
                this.chat_box.hide();
                this.chat_box_opened = false;
            },

            set_chat_box_opened_false: function (argument) {
                console.log("hiding box");
                this.chat_box_opened = false;
            },

            show_chat_box: function () {
                this.chat_box.show();
                this.chat_box_opened = true;
            },

            show_counter: function (argument) {
                if(this.chat_box_opened){
                    this.counter = 0;
                }
                if( this.counter !== 0 ){
                    this.$el.find("span").html(this.counter).addClass("highlight");
                }else{
                    this.$el.find("span").html(this.counter).removeClass("highlight");
                }
            },

            onClose: function() {
                this.messages = null;
                if(this.chat_box){
                    this.chat_box.close();
                }
            }
        });
        // export stuff:
        return Member;
    });
