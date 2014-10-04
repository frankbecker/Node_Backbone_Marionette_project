define(['App',
        'jquery',
        'underscore',
        'backbone',
        'bb/Models/Profile/Profile',
        'bb/Views/Header/Header',
        'bb/Views/Register/Register',
        'bb/Views/Login/Login',
        'bb/Views/Signup/Signup',
        'bb/Views/Sidebar/Sidebar',
        'bb/Views/About/About',
        'bb/Views/Profile/Wall',
        'bb/Views/Pictures/Pictures',
        'bb/Views/Pictures/Create_Album',
        'bb/Views/Pictures/Album',
        'bb/Views/Friends/Friends'
    ],
    function(
        App,
        $,
        _,
        Backbone,
        Profile,
        Header,
        Register,
        Login,
        Signup,
        Sidebar,
        About,
        Wall,
        Pictures,
        Create_Album,
        Album,
        Friends
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
                "about/:id"   : "about",
                "friends/:id"     : "friends",
                "create_album"    : "create_album",
                "album/:user_id/:album_id"     : "album",
                "logout"      : "logout"
            },

            registration: function() {
                //App.mainRegion.show(new Register());
                //this.close_side_bar_view();
                App.mainRegion.show(new Login());
                this.close_unecessary_views();
            },

            login: function(){
                App.mainRegion.show(new Login());
                this.close_unecessary_views();
            },

            signup: function(){
                App.mainRegion.show(new Signup());
                this.close_unecessary_views();
            },

            profile: function(_id){
                var app_profile_in_view = this.fetch_profile(_id , Wall);
            },

            pictures: function(_id){
                var app_profile_in_view = this.fetch_profile(_id, Pictures);
            },

            about: function(_id){
                var app_profile_in_view = this.fetch_profile(_id, About);
            },

            friends: function(_id){
                var app_profile_in_view = this.fetch_profile(_id, Friends);
            },

            create_album: function(){
                this.build_side_bar_and_main_view(Create_Album, false);
            },

            album: function(user_id, album_id, img_id, commment_id){
                var options = {
                    album_id : album_id,
                    user_id : user_id,
                    img_id : img_id,
                    commment_id : commment_id
                };
                var album = new Album(options);
                var app_profile_in_view = this.fetch_profile(user_id, album);
             },

            build_side_bar_and_main_view: function(MainView , flag){
                if(typeof MainView === 'object'){
                    App.mainRegion.show(MainView);  /// view has already been initialized
                }else{
                    App.mainRegion.show(new MainView());
                }                
                if(!App.header_built){
                    App.headerRegion.show(new Header());
                }
                if(flag) return;
                 App.left_sidebar_region.show(new Sidebar());
            },

            /*
                This callback is always expecting a profile model
             */
            fetch_profile: function(_id , View, Flag){
                if(App.Profile_in_View && App.Profile_in_View.get("_id") == _id){
                    this.build_side_bar_and_main_view(View, Flag);
                   return;
                }
                var self = this;
                App.Profile_in_View = new Profile({ _id : _id });
                App.Profile_in_View.fetch({
                    success: function() {
                        self.build_side_bar_and_main_view(View, Flag);
                        self = null;
                    },
                    error: function(model, response) {
                        alert("User not found.");
                    }
                });
            },

            close_unecessary_views: function(){
                try{
                    App.left_sidebar_region.close();
                }catch(err){

                }
                try{
                    App.headerRegion.close();
                    App.header_built = false;
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
            },

            logout: function(){
                App.Log_User_Out();
            }
        });


        // export stuff:
        return AppRouter;
    });
