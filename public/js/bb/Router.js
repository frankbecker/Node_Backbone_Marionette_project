define(['App',
        'jquery',
        'underscore',
        'backbone',
        'bb/Models/Profile/Profile',
        'bb/Views/Register/Register',
        'bb/Views/Login/Login',
        'bb/Views/Signup/Signup',
        'bb/Views/Sidebar/Sidebar',
        'bb/Views/About/About',
        'bb/Views/Profile/Wall',
        'bb/Views/Pictures/Pictures'
    ],
    function(
        App,
        $,
        _,
        Backbone,
        Profile,
        Register,
        Login,
        Signup,
        Sidebar,
        About,
        Wall,
        Pictures
    ) {


        //Instantiated  == App.Router == new AppRouter();
        /**
         * We will not keep any code related to routes in AppRouter. We will rather create proper controllers that oversee management for a specific
         * route.  Within these controllers we can also have other controllers that can oversee specific TAB related interactions,
         * which should lead to different Views and user interactions within a common region that should be managed by a controller.
         *
         */
        var AppRouter = Backbone.Router.extend({

            initialize: function() {
                this.routesHit = 0;
                this.history_fragment_array = [];
                //keep count of number of routes handled by your application
                Backbone.history.on('route', this.keep_track_history, this);
                this.sidebar = null;
            },

            routes: {
                ""          : "registration",
                "login"     : "login",
                "signup"    : "signup",
                "profile/:id" : "profile",
                "pictures/:id" : "pictures",
                "about/:id"   : "about"
            },

            registration: function() {
                //App.mainRegion.show(new Register());
                //this.close_side_bar_view();
                App.mainRegion.show(new Login());
                this.close_side_bar_view();
            },

            login: function(){
                App.mainRegion.show(new Login());
                this.close_side_bar_view();
            },

            signup: function(){
                App.mainRegion.show(new Signup());
                this.close_side_bar_view();
            },

            profile: function(_id){
                var app_profile_in_view = this.fetch_profile(_id);
                this.show_main_region_with_profile_in_view(app_profile_in_view , Wall);
            },

            pictures: function(_id){
                return;
            },

            about: function(_id){
                var app_profile_in_view = this.fetch_profile(_id);
                this.show_main_region_with_profile_in_view(app_profile_in_view , About);
            },

            show_main_region_with_profile_in_view: function(app_profile_in_view, View){
                var self = this;
                if(App.HELPER_isPromise(app_profile_in_view)){
                    app_profile_in_view.done(function(){
                        self.build_side_bar_and_main_view(app_profile_in_view, View);
                        self = null;
                    }).fail(function(){
                        console.log("Something went wrong fetching profile in view");
                    });
                }else{
                    this.build_side_bar_and_main_view(app_profile_in_view, View);
                }
            },

            build_side_bar_and_main_view: function(app_profile_in_view, MainView , flag){
                App.mainRegion.show(new MainView({ model: app_profile_in_view }));
                App.left_sidebar_region.show(new Sidebar({model : app_profile_in_view }));
            },

            /*
                This callback is always expecting a profile model
             */
            fetch_profile: function(_id){
                if(App.Profile_in_View && App.Profile_in_View.get("_id") == _id){
                   return App.Profile_in_View;
                }
                App.Profile_in_View = new Profile({ _id : _id });
                App.Profile_in_View.fetch({
                    success: function() {
                    },
                    error: function(model, response) {
                        alert("User not found.");
                    }
                });
                return App.Profile_in_View;
            },

            close_side_bar_view: function(){
                try{
                     App.left_sidebar_region.close();
                }catch(err){

                }
            },

            keep_track_history: function(e) {
                this.routesHit++;
                this.history_fragment_array.push(Backbone.history.fragment);
            },

            back: function(trigger_change) {
                var trigger;
                var fragment_array_length = this.history_fragment_array.length;
                var last_route = this.history_fragment_array[fragment_array_length - 2];
                if (trigger_change) {
                    trigger = true;
                } else {
                    trigger = false;
                }
                this.navigate(last_route, {
                    trigger: trigger,
                    replace: true
                });
            }
        });


        // export stuff:
        return AppRouter;
    });
