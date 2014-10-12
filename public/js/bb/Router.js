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
        'bb/Views/Friends/Friends',
        'bb/Views/Chat/Chat'
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
        Friends,
        Chat
    ) {


        //Instantiated  == App.Router == new AppRouter();
        // You can access App.Router any where in the application, if you define "App" as a dependency in your modules
        var AppRouter = Backbone.Router.extend({

            initialize: function() {
                this.on('all', function(routeEvent) {
                    $('html, body').animate({ scrollTop: 0 }, 0);  /// scroll to top on every route
                });
                this.routesHit = 0;
                this.history_fragment_array = [];
                this.chat_built = false;
                this.header_built = false;
                //keep count of number of routes handled by your application
                Backbone.history.on('route', this.keep_track_history, this);
            },

            routes: {
                ""          : "registration",
                "login"     : "login",
                "signup"    : "signup",
                "profile/:id" : "profile",
                "profile/:id/:comment" : "profile",
                "profile/:id/:comment/:sub_comment_id" : "profile",
                "pictures/:id" : "pictures",
                "about/:id"   : "about",
                "friends/:id"     : "friends",
                "create_album"    : "create_album",
                "album/:user_id/:album_id"     : "album",
                "album/:user_id/:album_id/:img_id"     : "album",
                "album/:user_id/:album_id/:img_id/:commment_id"     : "album",
                "logout"      : "logout"
            },

            registration: function() {
                //App.mainRegion.show(new Register());
                //this.close_side_bar_view();
                App.mainRegion.show(new Login());
                this.close_unecessary_views();
                this.logout();
            },

            login: function(){
                App.mainRegion.show(new Login());
                this.close_unecessary_views();
                this.logout();
            },

            signup: function(){
                App.mainRegion.show(new Signup());
                this.close_unecessary_views();
                this.logout();
            },

            profile: function(_id, commment_id, sub_comment_id){
                var options = {
                    comment_id : commment_id,
                    sub_comment_id : sub_comment_id
                };
                var app_profile_in_view = this.fetch_profile(_id , Wall, options);
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

            build_side_bar_and_main_view: function(MainView , options, flag){
                if(typeof MainView === 'object'){
                    App.mainRegion.show(MainView);  /// view has already been initialized
                }else if(options){
                    App.mainRegion.show(new MainView(options));
                }else{
                    App.mainRegion.show(new MainView());
                }
                if(!this.header_built){
                    App.headerRegion.show(new Header());
                    this.header_built = true;
                }
                if(!this.chat_built){
                    App.chatRegion.show(new Chat());
                    this.chat_built = true;
                }
                if(flag) return;
                 App.left_sidebar_region.show(new Sidebar());
            },

            /*
                This callback is always expecting a profile model
             */
            fetch_profile: function(_id , View, options, Flag){
                if(App.Profile_in_View && App.Profile_in_View.get("_id") == _id){
                    this.build_side_bar_and_main_view(View, options, Flag);
                   return;
                }
                var self = this;
                App.Profile_in_View = new Profile({ _id : _id });
                App.Profile_in_View.fetch({
                    success: function() {
                        self.build_side_bar_and_main_view(View, options, Flag);
                        self.fetch_session_friends();
                        self = null;
                    },
                    error: function (err, resp, options) {
                        App.handle_bad_response(resp);
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
                    this.header_built = false;
                }catch(err){

                }
                try{
                    App.chatRegion.close();
                    this.chat_built = false;
                }catch(err){

                }
            },

            fetch_session_friends: function () {
                var self = this;
                var session_id = App.Session.get("_id");
                App.Friends.fetch({

                    data: $.param({ user_id: session_id}),

                    silent: true,

                    success:function(collection, response, options){
                        App.Friends.trigger("fetched");
                    },
                   
                    error: function (err, resp, options) {
                        App.handle_bad_response(resp);
                    }
               });
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
