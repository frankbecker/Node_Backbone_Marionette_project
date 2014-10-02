// app/routes.js
var User_route = require('./routes/route_user');
var Comments_route = require('./routes/route_comments');
var Albums_route = require('./routes/route_albums');
module.exports = function(app, passport) {

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	/*app.get('/login', function(req, res) {
		console.log(req.cookies);
		// render the page and pass in any flash data if it exists
		//res.render('login.ejs', { message: req.flash('loginMessage') });
	});*/

	/*app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));*/
	// process the login form
	app.post('/login', function(req, res, next) {
		passport.authenticate('local-login', {session: true}, function(err, user, info) {
			if (err)return next(err);
			if (user === false) {
				return res.send(401, info);
				} else {
				req.logIn(user, function(err) {
					if (err) { return res.send({'status':'err','message':err.message}); }
					req.app.set('user_legged_in', user._id);
					req.session.user = user;
					return res.send(200, user);	
				});
			}
		})(req, res, next);
	});

	app.post('/signup', function(req, res, next) {
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
	app.get('/user', User_route.findAll);
	app.get('/user/:id', User_route.findById);
	app.put('/user/:id', User_route.updateUser);
	app.delete('/user/:id', User_route.deleteUser);
	app.post('/upload_img', User_route.upload_img);


	// =====================================
	// COMMENTS WALL, MAINLY =========================
	// =====================================
	app.get('/comments', Comments_route.findByUser);
	app.get('/comments/:id', Comments_route.findById);
	app.put('/comments/:id', Comments_route.updateComment);
	app.delete('/comments/:id', Comments_route.deleteComment);
	app.post('/comments', Comments_route.addComment);

	// =====================================
	// COMMENTS WALL, MAINLY =========================
	// =====================================
	app.get('/album', Albums_route.findAll);
	app.get('/album/:id', Albums_route.Album_findById);
	app.put('/album/:id', Albums_route.updateAlbum);
	app.delete('/album/:id', Albums_route.deleteAlbum);
	app.post('/album', Albums_route.addAlbum);
	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	//app.all('*', isLoggedIn);
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	console.log("isLoggedIn");
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.send(401,'Session Expired');
}
