/*
Author: Francisco Becker
 */
// Set the require.js configuration
require.config({

    // If no baseUrl is explicitly set in the configuration, the default value
    // will be the location of the HTML page that loads require.js.
    // If a data-main attribute is used, that path will become the baseUrl.

    // Path mappings for module names not found directly under baseUrl.
    // The path settings are assumed to be relative to baseUrl, unless the paths
    // setting starts with a "/" or has a URL protocol in it ("like http:").
    // In those cases, the path is determined relative to baseUrl.
    paths: {

        baseUrl: 'js',

        urlArgs: "v=" + (new Date()).getTime(),

        // Libraries
        jquery: 'lib/jquery-1.11.1.min',
        underscore: 'lib/underscore-min',
        backbone: 'lib/backbone-min',
        bootstrap: 'lib/bootstrap.min',
        handlebars: 'lib/handlebars-v1.3.0',
        text: 'lib/text',
        'jquery.cookie': 'lib/jquery.cookie',
        marionette: 'lib/backbone.marionette.min',
        'backbone.wreqr': 'lib/backbone.wreqr',
        'backbone.babysitter': 'lib/backbone.babysitter',
        'idle'   :  'lib/jquery.idle.min',
        io  : 'lib/socket.io-1.1.0'

    },

    // Configure the dependencies and exports for older, traditional "browser globals"
    // scripts that do not use define() to declare the dependencies and set a module value.
    shim: {

        underscore: {
            exports: "_"
        },

        backbone: {
            // These script dependencies should be loaded before loading backbone.js
            deps: ["underscore", "jquery"],
            // Once loaded, use the global "Backbone" as the module value.
            exports: "Backbone"
        },

        bootstrap: {
            deps: ['jquery']
        },

        'jquery.cookie': { //<-- cookie depends on Jquery and exports nothing
            deps: ['jquery']
        },

        handlebars: {
            exports: 'Handlebars'
        },

        marionette: {
            deps: ['jquery', 'underscore', 'backbone'],
            exports: 'Marionette'
        },

        idle: {
            deps: ['jquery'],
            exports: 'idle'
        }

    }
});


require([
    "App",
    "jquery",
    "backbone",
    "bb/Router",
    "bb/Models/Session/Session",
    'bb/Collections/Profiles/Profiles'
], function(
    App,
    $,
    Backbone,
    AppRouter,
    Session,
    Profiles
    ){
    /// This file and addInitializer function server as an abstraction layer,
    /// so that we don't create a circular dependecy,
    /// meaning Session requires App, and if we require Session in App we will create a circular dependency, and if that happens nothing works
    App.addInitializer(function() {
         App.Router = new AppRouter();
         App.Friends = new Profiles();
          App.reload_session = function() {
            App.Session = new Session();
        }();
    });

    App.start({});

});
