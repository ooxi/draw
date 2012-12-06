/**
 * 2012 github/ooxi
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
var EtherDraw = require('./etherdraw.js');



/* TODO Configuration should be read from file
 */
var configuration = {
  port: 3000,
  database: {
    implementation: 'dirty'
  }
}


/* Initialize server
 */
var server = EtherDraw.Server(configuration, function(err) {
  if (err) throw err;
  console.log('EtherDraw up and running :-)');
});





return;

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
    console.log('draw:progress %j', JSON.parse(co_ordinates));
    //io.sockets.emit('draw:progress', uid, co_ordinates);

  });

  // EVENT: User stops drawing something
  socket.on('draw:end', function (uid, co_ordinates) {
    console.log('draw:end %j', JSON.parse(co_ordinates));
    io.sockets.emit('draw:end', uid, co_ordinates);

  });
  
});


