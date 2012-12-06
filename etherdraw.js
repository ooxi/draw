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
var async = require('async');
var express = require('express');
var socket = require('socket.io');
var ueberDB = require('ueberDB');





/**
 * Manages the entire EtherDraw server state
 *
 * @param configuration.port Port to listen on for HTTP requests
 * @param cb Will be invoked as soon as EtherDraw is initialized
 *
 * @warning This application does not, and will never, support HTTPS. It should
 *     only be used behind an nginx frontend. Static files served by EtherDraw
 *     are an error in production!
 */
exports.Server = function(configuration, cb) {

  /**
   * ueberDb database handle
   */
  var _db;

  /**
   * Express application handle and node http server
   */
  var _app;
  var _http;

  /**
   * Socket.IO handle
   */
  var _io;





  /* Will be invoked as soon as a client connects to a sketch
   */
  var onConnect = function(socket) {
    console.log('Client connected');
  };





  /* Application initialization has to be done one by one
   */
  async.series([

    /* Load persistence module
     */
    function(cb) {
      var database = new ueberDB.database(
          configuration.persistence.implementation,
          configuration.persistence.properties
      );

      database.init(function(err) {
        cb(err);
      });
    },



    /* Express setup
     */
    function(cb) {
      _app = express();

      /* Since _all_ requests served by EtherDraw in production are dynamic,
       * installing session parsers first does not do any harm
       */
      _app.use(express.cookieParser());
      _app.use(express.session({
          secret: 'secret',
          key: 'express.sid'
      }));

      /* TODO Embedd stroke data in response to save an additional roundtrip
       */
      _app.get('/d/*', function(req, res){
         console.log('Request %j', req);
         res.sendfile(__dirname + '/src/static/html/draw.html');
      });

      /* Create server, but do not bind to any interface yet
       */
      _http = require('http').createServer(_app);
      cb();
    },



    /* Register socket.io handler
     */
    function(cb) {
      _io = socket.listen(_http);
      _io.sockets.on('connection', onConnection);

      cb();
    },


    /* Listen on configured interface
     */
    function(cb) {
      _http.listen(configuration.port);
      cb();
    }



  /* Last but not least invoke callback given at object creation
   */
  ], cb);

};

