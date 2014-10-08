define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Pictures/Pictures.html',
        'bb/Collections/Pictures/Albums',
        'bb/Views/Pictures/Album_Cover'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template,
        Albums,
        Album_Cover
    ) {

        var Pictures = Marionette.View.extend({

            className: "Pictures",

            template: Handlebars.compile(Template),

            events: {
                "click button#create_album"  : "trigger_navigate"
            },

            initialize: function() {
                this.profile_in_view = App.Profile_in_View;
                this.profile_logged_in = App.Session;
                this.match = ((this.profile_in_view.get("_id") == this.profile_logged_in.get("_id")) ? true : false);
                this.collection = new Albums();
                this.childViews = [];      //GARBAGE COLLECTION
            },

            render: function() {
                $(this.el).html(this.template());
                    var self = this;
                    setTimeout(function(){
                        self.fetch_albums();
                        if(self.match){                            
                            self.add_create_button();
                        }
                        self = null;
                    },0);
                return this;
            },

            trigger_navigate: function(){
                App.Router.navigate('create_album', { trigger: true });
            },

            add_create_button: function(){
                var btn_html = "<button id='create_album' type='button' class='btn btn-primary'><span class='glyphicon glyphicon-plus'></span>Create new Album</button>";
                $(".header_container", this.el).append(btn_html);
            },

            fetch_albums: function(){
                var self = this;
                var profile_id = this.profile_in_view.get("_id");
                this.collection.fetch({
                    data: $.param({ user_id: profile_id}),

                    update: true,

                    success: function(albums, response, options){
                        self.populate_albums();
                        self = null;
                    },
                    error: function (err, resp, options) {
                        self = null;
                    App.handle_bad_response(resp);
                    }
                });
            },

            populate_albums: function(){
                var self = this;
                var $ul = $(".album_container ul", this.el);
                this.collection.each(function(album){
                    var album_cover = new Album_Cover({ model : album });
                    self.childViews.push(album_cover);
                    $ul.append(album_cover.el);
                });
                self = null;
                $ul = null;
            },

            onClose: function() {
                _.each(this.childViews, function(childView){
                      if (childView.close){
                        childView.close();
                      }
                });
            }
        });
        // export stuff:
        return Pictures;
    });
