# Node, Express, Mongoose, Require, Backbone, Marionette Project

I pigged back off of https://github.com/scotch-io/easy-node-authentication

This repo uses passport for user authentication.

I've built a commenting wall, and I am still adding more features to this project.

If you wish to view it, pull the repo down, make sure you have MongoDB installed and running.
Run npm install and node server.js at the project root and the magic should happen at port 8080.

Like I said I am still adding on to the project.

Oh and it's all Async.


Heads up!!!!
I modified one of the node-modules : "connect-mongo"
node_modules/connect-mongo/lib/connect-mongo.js //////  Line #248, I added a session_obj to the record being created.
I did this so that I could easily query for current sessions.
"connect-mongo" is a great package but for some reason it would break when setting stringify to false as an option.
So I hacked it, the session was being set as a string, but I need an object. 
I <3 Objects