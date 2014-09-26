// app/routes.js
var User_route = require('./routes/User');
module.exports = function(app, passport) {

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		console.log(req.cookies);
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', function(req, res, next) {
		passport.authenticate('local-login', function(err, user, info) {
			if (err)return next(err);
			if (user === false) {
				return res.send(401, info);
				} else {
				return res.send(200, user);
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

	app.get('/user/:id', User_route.findById);
	app.put('/user/:id', User_route.updateUser);
	app.delete('/user/:id', User_route.deleteUser);
	app.post('/upload_img', User_route.upload_img);

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
