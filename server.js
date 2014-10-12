/*
Author: Francisco Becker
 */
// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
// making this a global /// because I also need to access this in my schema so that I can delete some files
var MongoStore = require('connect-mongo')(express);
app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database
var sessionOpts = {
	key: "token",
	secret: 'ilovescotchscotchyscotchscotch',
	cookie: { maxAge: 30 * 60 * 1000 },  /// 30 minute Session
	store: new MongoStore({
      db : mongoose.connection.db
    })
};

app.set('root_directory', __dirname);
// configuration ===============================================================

require('./config/passport')(passport, app); // pass passport for configuration

app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms
	app.use(express.static(__dirname + '/public'));
	app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
	app.use(express.session(sessionOpts)); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session

});

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================

var server = app.listen(port);
var socket = require('socket.io');
var io = socket.listen(server);
require('./app/routes/socket_chat')(app, io); //  Socket.IO Chat
console.log('The magic happens on port ' + port);
