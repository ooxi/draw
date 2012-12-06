/**
 * Module dependencies.
 */

var express = require("express");
var app = express();

var socket = require('socket.io');
app.configure(function(){
  app.use(express.static(__dirname + '/'));
});

var ueberDb = require('ueberDB');



/**
 * A setting, just one
 *
 * TODO Should be read from file
 */

var configuration = {
  port: 3000
};



/** Below be dragons 
 *
 */

// DATABASE CONNECTIVITY
//var db = ueberDb.database(configuration.database

// SESSIONS
app.use(express.cookieParser());
app.use(express.session({
  secret: 'secret',
  key: 'express.sid'
}));

// DEV MODE
app.configure('development', function(){
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

// PRODUCTON MODE
app.configure('production', function(){
  app.use(express.errorHandler());
});

// ROUTES
// Index page
app.get('/', function(req, res){
  res.sendfile(__dirname + '/src/static/html/index.html');
});

// Drawings
app.get('/d/*', function(req, res){
  res.sendfile(__dirname + '/src/static/html/draw.html');
});

// Static files IE Javascript and CSS
app.use("/static", express.static(__dirname + '/src/static'));

// LISTEN FOR REQUESTS
var server = app.listen(configuration.port);
var io = socket.listen(server);

// SOCKET IO
var active_connections = 0;
io.sockets.on('connection', function (socket) {

  active_connections++;

  io.sockets.emit('user:connect', active_connections);

  socket.on('disconnect', function () {
    active_connections--;
    io.sockets.emit('user:disconnect', active_connections);
  });

  // EVENT: User stops drawing something
  socket.on('draw:progress', function (uid, co_ordinates) {
    console.log('draw:progress %j', co_ordinates);
    io.sockets.emit('draw:progress', uid, co_ordinates);

  });

  // EVENT: User stops drawing something
  socket.on('draw:end', function (uid, co_ordinates) {
    console.log('draw:end %j', co_ordinates);
    io.sockets.emit('draw:end', uid, co_ordinates);

  });
  
});


