// app/routes.js
var Projects_route = require('./routes/route_projects');
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
	/*app.get('/user', isLoggedIn, User_route.findAll);
	app.get('/user/:id', isLoggedIn, User_route.findById);
	app.put('/user/:id', isLoggedIn, User_route.updateUser);
	app.delete('/user/:id', isLoggedIn, User_route.deleteUser);
	app.post('/upload_img', isLoggedIn, User_route.upload_img);*/

/*repo
repo/id
repo/id/file
repo/id/file/filename
repo/id/dir
repo/id/dir/dirname
repo/id/comments
project/
project/id/repos
project/id/comments
repo list from github
repo view 
repo view files
repo file view
repo dir list view
repo dir view
repo comments list
project repos list
project comments lis*/

	app.get('/projects' , Projects_route.find_all);


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
