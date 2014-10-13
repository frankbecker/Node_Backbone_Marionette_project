define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/SideBar.html'
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

        var SideBar = Marionette.View.extend({

            className: "SideBar",

            template: Handlebars.compile(Template),

            events: {
                
            },

            initialize: function() {
                this.model = App.Profile_in_View;
                if(!this.model){
                  this.model =  App.Session;
                }
                this.listenTo(App, 'update_side_bar', this.render);
                this.listenTo(this.model, 'change', this.render);
            },

            render: function() {
                var self = this;
                $(this.el).html(this.template(this.model.toJSON()));
                setTimeout(function(){
                    self.highlight_proper_nav();
                    self = null;
                },0);
                return this;
            },

            highlight_proper_nav : function(){
                var current_route = Backbone.history.fragment;
                var route = current_route;
                try{
                    current_route = current_route.substr(0, current_route.indexOf('/'));
                }catch(err){
                    // if no foward slash is found continue on with that route
                }
                if(current_route == ""){
                    current_route = route;
                }
                current_route = this.match_route(current_route);
                this.$el.find(".nav_"+current_route).addClass("active");
            },

            match_route : function(route_name){
                var array_paths = [];
                array_paths[0] =["pictures", "create_album", "album"];  /// pictures

                _.each(array_paths,function(array){
                    _.each(array, function(path){
                        if(route_name == path){
                            route_name = array[0];  /// return first value of the array, which should be the main navigation
                        }
                    });
                });

                return route_name;
            },

            onClose: function() {
                this.model.unbind();
                this.model = null;
            }
        });
        // export stuff:
        return SideBar;
    });
