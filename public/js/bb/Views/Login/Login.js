define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Login/Login.html',
        'bb/Models/Session/Session'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template,
        Session
    ) {

        var Login = Marionette.View.extend({

            className: "Login",

            template: Handlebars.compile(Template),

            events: {
               // "click button": "login"
               "click .profile_wrapper": "login"
            },

            initialize: function() {
                
            },

            render: function() {
                $(this.el).html(this.template());
                return this;
            },

            validate: function(){
                var $input_email = $("#email", this.el);
                var $input_password = $("#password", this.el);
                var $alert = $(".alert", this.el);

                if($input_email.val() === ""){
                   $alert.removeClass("hide").html("Plese provide email.");
                }else if($input_password.val() === ""){
                   $alert.removeClass("hide").html("Plese provide password.");
                }else if($input_email.val() === "" && $input_password.val() === ""){
                    $alert.removeClass("hide").html("Plese provide email, and password.");
                }else{
                   $alert.addClass("hide");
                   return true;
                }
                return false;
            },

            /*login: function(e){
                e.preventDefault();
                if(!this.validate())return;
                var input_email = $("#email", this.el).val();
                var input_password = $("#password", this.el).val();
                var $alert = $(".alert", this.el);
                $.ajax({
                type: "POST",
                url: "/login",
                data: { email: input_email, password: input_password }
                })
                .done(function( response ) {
                    App.Success_Login(response);
                })
                .fail(function( xhr ){
                    $alert.removeClass("hide").html(xhr.responseText);
                });
            },*/
            login: function(e){
                e.preventDefault();
                var input_email = $(e.currentTarget).find('.thumb-container').attr('data-username');
                var input_password = $(e.currentTarget).find('.thumb-container').attr('data-password');
                var $alert = $(".alert", this.el);
                $.ajax({
                type: "POST",
                url: "/login",
                data: { email: input_email, password: input_password }
                })
                .done(function( response ) {
                    App.Success_Login(response);
                })
                .fail(function( xhr ){
                    $alert.removeClass("hide").html(xhr.responseText);
                });
            },

            onClose: function() {

            }
        });
        // export stuff:
        return Login;
    });
