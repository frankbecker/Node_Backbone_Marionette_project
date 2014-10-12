# Node, Express, Mongoose, Require, Backbone, Marionette Project

I pigged back off of https://github.com/scotch-io/easy-node-authentication

This repo uses passport for user authentication.

I've built a social network all in Javascript.

If you wish to view it, pull the repo down, make sure you have MongoDB installed and running.
Run node server.js at the project root and the magic should happen at port 8080.

Like I said I am still adding on to the project.

Oh and it's all Async.

Heads up!!!!
You don't need to run an NPM install, because I have included all the modules as part of this repo.
AND
I modified one of the node-modules : "connect-mongo"
node_modules/connect-mongo/lib/connect-mongo.js //////  Line #248, I added a session_obj to the record being created.
I did this so that I could easily query for current sessions.
"connect-mongo" is a great package but for some reason it would break when setting stringify to false as an option.
So I hacked it, the session was being set as a string, but I need an object. 
I <3 Objects

Here is a link to the project <a href"http://sheltered-sierra-9661.herokuapp.com/">http://sheltered-sierra-9661.herokuapp.com/</a>