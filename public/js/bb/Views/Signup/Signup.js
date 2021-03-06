define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Signup/Signup.html'
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

        var Signup = Marionette.View.extend({

            className: "Signup",

            template: Handlebars.compile(Template),

            events: {
                "click button": "signup"
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

            signup: function(e){
                e.preventDefault();
                if(!this.validate())return;
                var input_email = $("#email", this.el).val();
                input_email = _.escape(input_email); 
                var input_password = $("#password", this.el).val();
                input_password = _.escape(input_password);
                var $alert = $(".alert", this.el);
                $.ajax({
                type: "POST",
                url: "/signup",
                data: { email: input_email, password: input_password }
                })
                .done(function( response ) {
                    App.Success_SignUp(response);
                })
                .fail(function( xhr ){
                    $alert.removeClass("hide").html(xhr.responseText);
                });
            },

            onClose: function() {

            }
        });
        // export stuff:
        return Signup;
    });
