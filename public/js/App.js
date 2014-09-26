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

        App.Success_Login = function(response) {
            App.Session.save(response);
            App.Router.navigate('profile/'+App.Session.get("_id"), {
                trigger: true
            });
        };

        App.Log_User_Out = function() {
            App.Session.clear();
            App.Router.navigate('', {
                trigger: true
            });
        };

        App.HELPER_isPromise = function (value) {
            if (typeof value.then !== "function") {
                return false;
            }
            var promiseThenSrc = String($.Deferred().then);
            var valueThenSrc = String(value.then);
            return promiseThenSrc === valueThenSrc;
        };


        return App;

    });
