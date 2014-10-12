var Sessions = require('../models/schema_session');
var _ = require('underscore');

module.exports = function(app, io) {
  io.sockets.on('connection', function (socket) {
   var users = [];
    socket.on('add user', function (user) {
      socket._id = app.get('user_logged_in');
      if(!socket._id){  /// this is just a fallback
        socket._id = user._id;
      }
          var promise = Sessions.find({}).exec();
          promise.then(function (sessions) {
            users = [];
              _.each(sessions, function (online_session) {
                users.push(online_session.user);
              });
              io.sockets.emit('user joined', users);
          });
    });

    socket.on('new message', function (data) {
      var to_id = data.to_id;
      var message = data.message;
      if(to_id == socket._id)return;
      io.sockets.emit('new message', {
          from: socket._id,
          to: to_id,
          message: message
        });
    });


    socket.on('typing', function () {
      io.sockets.emit('typing', {
        user_id: socket._id
      });
    });

    socket.on('stop typing', function () {
      io.sockets.emit('stop typing', {
        user_id: socket._id
      });
    });

    socket.on('user left', function () {
      console.log("user logged out:"+ socket._id);
      var index = users.indexOf(socket._id);
          if (index > -1) {
          users.splice(index, 1);
          }
      io.sockets.emit('user left', {
        user_id: socket._id
      });
    });

    socket.on('disconnect', function (user) {
      if(!socket._id){
        socket._id = app.get('user_logged_in');
      }
      if(!socket._id){ /// this is just a fall back
          socket._id = user._id;
      }
      
      var index = users.indexOf(socket._id);
          if (index > -1) {
              users.splice(index, 1);
          }
            io.sockets.emit('user left', {
              user_id: socket._id
            });
    });

  }); /// io
};