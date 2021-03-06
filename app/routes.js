// app/routes.js
var User_route = require('./routes/route_user');
var Comments_route = require('./routes/route_comments');
var Albums_route = require('./routes/route_albums');
var Image_route = require('./routes/route_image');
var Notif_route = require('./routes/route_notifications');
module.exports = function(app, passport) {	

	// =====================================
	// LOGIN ===============================
	// =====================================
	app.post('/login', already_logged_in, function(req, res, next) {
		passport.authenticate('local-login', {session: true}, function(err, user, info) {
			if (err)return next(err);
			if (user === false) {
				return res.send(401, info);
				} else {
				req.logIn(user, function(err) {
					if (err) { return res.send({'status':'err','message':err.message}); }
					req.app.set('user_logged_in', user._id);
					return res.send(200, user);	
				});
			}
		})(req, res, next);
	});

	app.post('/signup', already_logged_in, function(req, res, next) {
		passport.authenticate('local-signup', function(err, user, info) {
		if (err) return next(err);
		if (user === false) {
			return res.send(404, info);
			} else {
			return res.send(200, user);
		}
		})(req, res, next);
	});

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/user', isLoggedIn, User_route.findAll);
	app.get('/user/:id', isLoggedIn, User_route.findById);
	app.put('/user/:id', isLoggedIn, User_route.updateUser);
	app.delete('/user/:id', isLoggedIn, User_route.deleteUser);
	app.post('/upload_img', isLoggedIn, User_route.upload_img);


	// =====================================
	// COMMENTS WALL, MAINLY =========================
	// =====================================
	app.get('/comments', isLoggedIn, Comments_route.findComments);
	app.get('/comments/:id', isLoggedIn, Comments_route.findById);
	app.put('/comments/:id', isLoggedIn, Comments_route.updateComment);
	app.delete('/comments/:id', isLoggedIn, Comments_route.deleteComment);
	app.post('/comments', isLoggedIn, Comments_route.addComment);

	// =====================================
	// Album API =========================
	// =====================================
	app.get('/album', isLoggedIn, Albums_route.findAll);
	app.get('/album/:id', isLoggedIn, Albums_route.Album_findById);
	app.put('/album/:id', isLoggedIn, Albums_route.updateAlbum);
	app.delete('/album/:id', isLoggedIn, Albums_route.deleteAlbum);
	app.post('/album', isLoggedIn, Albums_route.addAlbum);

	// =====================================
	// Images API =========================
	// =====================================
	app.get('/image', isLoggedIn, Image_route.findAll);
	app.get('/image/:id', isLoggedIn, Image_route.Image_findById);
	app.put('/image/:id', isLoggedIn, Image_route.updateImage);
	app.delete('/image/:id', isLoggedIn, Image_route.deleteImage);
	app.post('/image', isLoggedIn, Image_route.addImage);

	// =====================================
	// Notifications API =========================
	// =====================================
	app.get('/notification', isLoggedIn, Notif_route.findAll);
	// =====================================
	// LOGOUT ==============================
	// =====================================	
	app.post('/loggin_out', isLoggedIn, User_route.logOut);
	//app.all('*', isLoggedIn);
	
	// route middleware to make sure
	function isLoggedIn(req, res, next) {
		console.log("isLoggedIn");
		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
			return next();

		// if they aren't redirect them to the home page
		req.logout();
		res.send(401,'Session Expired');
	}

	function already_logged_in (req, res, next) {
		if (!req.isAuthenticated()) return next();

		res.send(499,'You are already logged in with this Browser, please use a different one. Thanks!');
	}
};
