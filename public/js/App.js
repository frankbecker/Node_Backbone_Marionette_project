define([
        // Libs
        "underscore",
        "marionette",
        "backbone",
        "jquery.cookie",
        "idle",
        "io"
    ],

    function(_, Marionette, Backbone, cookie, idle, io) {

        var App;

        App = new Backbone.Marionette.Application();
        App.io = io();
        App.Router = {};
        App.Header = {};
        App.Footer = {};
        App.Dialog = {};
        App.Session = {};
        App.Friends = {};
        App.Profile_in_View = null;
        App.user_idle = false;
        App.logged_in = false;
        App.comment_editing_no_comment_fecthing = false;

        App.addRegions({
            headerRegion: "#header_region",
            mainRegion: "#container_region",
            left_sidebar_region: "#left_sidebar_region",
            footerRegion: "#footer_region",
            chatRegion: "#chat_region",
            dialogsRegion: "#dialogs"
        });

        App.on("initialize:before", function(options) {
            App.start_idle();
        });


        App.on("start", function(options) {
            if (Backbone.history) {
                Backbone.history.start();
            }
        });


        App.on("initialize:after", function(options) {

        });

        
        App.Success_SignUp = function(response) {
            var callback = function(){
                App.Router.navigate('about/'+App.Session.get("_id"), {
                    trigger: true
                 });
            };
            App.logged_in = true;
            App.Session.save_session(response, callback); /// I need this call back because the setcookies function takes way too long to return
        };

        App.Success_Login = function(response) {
            var callback = function(){
                App.Router.navigate('profile/'+App.Session.get("_id"), {
                    trigger: true
                 });
            };
            App.logged_in = true;
            App.Session.save_session(response, callback); /// I need this call back because the setcookies function takes way too long to return
        };

        App.Log_User_Out = function() {
            console.log("logging out");
            App.logged_in = false;
            App.Session.clear();
            App.Router.navigate('', {
                trigger: true
            });
            setTimeout(function(){
               $.ajax({
                type: "POST",
                url: "/loggin_out"
                })
                .done(function( response ) {
                    console.log("user has been logout");
                })
                .fail(function( xhr ){
                    console.log("something went wrong in logout");
                });
            },1000);
        };

        App.GET_comment_editing_no_comment_fecthing = function(){
            return this.comment_editing_no_comment_fecthing;
        };

        App.SET_comment_editing_no_comment_fecthing = function(value){  /// boolean
            this.comment_editing_no_comment_fecthing = value;
            this.trigger("change:comment_editing_no_comment_fecthing");
        };

        /*  !!!!!! ATTENTION
        The function below is very important, if the user becomes idle all requests that are happening in Interval will be suspended
        Check Views : Wall.js and Header.js for more info.
        Any other place in the code where there is a request being made every few seconds, this implementation will be necessary,
        so that we can let the Backend Session expire properly, more info in Server.js and routes.js
         */

        App.start_idle = function () {
            $(document).idle({
              onIdle: function(){
                App.user_idle = true;
                App.trigger("user_idle");
              },
              onActive: function(){
                App.user_idle = false;
                App.trigger("user_idle");
              },
              idle: 10000
            });
        };

        App.handle_bad_response = function(resp){
            var status_code = resp.status;
            var message;
            if(status_code == 401){
                message = "Your Session has expired.";
                App.Router.navigate('', {
                    trigger: true
                });
            }else if(status_code == 499){
                message = resp.responseText;
            }
            $("#app_modal .modal-body b").html(message);
            $("#app_modal").modal('show');
        };


        return App;

    });
