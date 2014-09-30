define([
        // Libs
        "underscore",
        "marionette",
        "backbone",
        "jquery.cookie"
    ],

    function(_, Marionette, Backbone, cookie) {

        var App;

        App = new Backbone.Marionette.Application();
        App.Router = {};
        App.Header = {};
        App.Footer = {};
        App.Dialog = {};
        App.Session = {};
        App.Profile_in_View = null;
        App.header_built = false;
        App.comment_editing_no_comment_fecthing = false;

        App.addRegions({
            headerRegion: "#header_region",
            mainRegion: "#container_region",
            left_sidebar_region: "#left_sidebar_region",
            footerRegion: "#footer_region",
            dialogsRegion: "#dialogs"
        });

        App.on("initialize:before", function(options) {

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
            App.Session.save(response, callback); /// I need this call back because the setcookies function takes way too long to return
        };

        App.Success_Login = function(response) {
            var callback = function(){
                App.Router.navigate('profile/'+App.Session.get("_id"), {
                    trigger: true
                 });
            };
            App.Session.save(response, callback); /// I need this call back because the setcookies function takes way too long to return
        };

        App.Log_User_Out = function() {
               $.ajax({
                type: "GET",
                url: "/logout",
                })
                .done(function( response ) {
                    console.log("user has been logout");
                })
                .fail(function( xhr ){
                    console.log("something went wrong in logout");
                });
            App.Session.clear();
            App.Router.navigate('', {
                trigger: true
            });
        };

        App.GET_comment_editing_no_comment_fecthing = function(){
            return this.comment_editing_no_comment_fecthing;
        };

        App.SET_comment_editing_no_comment_fecthing = function(value){  /// boolean
            this.comment_editing_no_comment_fecthing = value;
            this.trigger("change:comment_editing_no_comment_fecthing");
        };


        return App;

    });
