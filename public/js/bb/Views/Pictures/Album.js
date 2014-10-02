define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Pictures/Album/Album.html',
        'bb/Models/Pictures/Album',
        'bb/Collections/Pictures/Images'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template,
        Album_model,
        Images
    ) {

        var Album = Marionette.View.extend({

            className: "Album",

            template: Handlebars.compile(Template),

            events: {
                
            },
            /*
                options = {_id}
             */
            initialize: function(options) {
                this.model = new Album_model({ _id : options._id });
                this.fetch_this_model();
                this.collection = new Images();
            },

            render: function() {
                return this;
            },

            fetch_this_model: function(){
                var self = this;
                this.model.fetch({

                   success:function(model, response, options){
                    self.my_own_render();
                    self = null;
                   },

                   fail:function(model, response, options){
                    console.log("Failure to fetch album model");
                   }
               });
            },

            my_own_render : function(){
                $(this.el).html(this.template(this.model.toJSON()));
                this.fetch_image_collection();
            },

            fetch_image_collection: function(){
                var album_id = this.model.get("_id");
                this.collection.fetch({

                   data: $.param({ album_id: album_id }),

                   silent: true,

                   success:function(collection, response, options){
                    console.log(collection);
                   },

                   fail:function(collection, response, options){
                    console.log("Falied to retrieve images for album");
                   }
               });
            },

            onClose: function() {

            }
        });
        // export stuff:
        return Album;
    });
