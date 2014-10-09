define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Chat/member.html'
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

        var Member = Marionette.View.extend({

            className: "Member",

            tagName: 'li',

            template: Handlebars.compile(Template),

            events: {
                
            },

            initialize: function() {
                this.listenTo(this.model, "change", this.render);
                this.render();
            },

            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            },

            onClose: function() {

            }
        });
        // export stuff:
        return Member;
    });
