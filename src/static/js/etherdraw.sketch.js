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





/**
 * Represents a sketch
 *
 * @param id String Sketch identifier
 * @param convas DOM Object to draw on
 * @param cb Function Will be invoked as soon as sketch is initialized (not
 *     necessarly drawn)
 */
var EtherDraw = EtherDraw || {};

EtherDraw.Sketch = EtherDraw.Sketch || function(id, canvas, cb) {



  /**
   * Callback is optional
   */
  cb = 'function' === typeof(cb) ? cb : function(err) {
    if (err) throw err;
  };



  /**
   * Establish backend connection
   */
  var _io = io.connect('/');

  /**
   * Initialize canvas
   */
  paper.setup(canvas);
  var _path = new paper.Path();
  var _tool = new paper.Tool();





  /* Register socket.io callbacks as soon as connection is established
   */
  _io.on('connect', function(socket) {
    _io.emit('etherdraw.join', id);
    cb();
  });




  /* Register paper.js handler
   */
  _tool.onMouseDown = function(event) {
    path = new paper.Path();
    path.fillColor = active_color_rgb;
    path.add(event.point);
    view.draw();

    // The data we will send every 100ms on mouse drag
    path_to_send = {
        rgba: active_color_json,
        start: event.point,
        path: []
    };
  };



  _tool.onMouseDrag = function(event) {
    var step = event.delta / 2;
    step.angle += 90;

    var top = event.middlePoint + step;
    var bottom = event.middlePoint - step;

    path.add(top);
    path.insert(0, bottom);
    path.smooth();
    view.draw();

    // Add data to path
    path_to_send.path.push({
        top: top,
        bottom: bottom
    });

    // Send paths every 100ms
    if (!timer_is_active) {

      send_paths_timer = setInterval(function () {

        socket.emit('draw:progress', uid, JSON.stringify(path_to_send));
        path_to_send.path = new Array();

      }, 100);
    }

    timer_is_active = true;
  };



  _tool.onMouseUp = function(event) {
    // Close the users path
    path.add(event.point);
    path.closed = true;
    path.smooth();
    view.draw();

    // Send the path to other users
    path_to_send.end = event.point;
    socket.emit('draw:end', uid, JSON.stringify(path_to_send));

    // Stop new path data being added & sent
    clearInterval(send_paths_timer);
    path_to_send.path = new Array();
    timer_is_active = false;
  };










/*
  // Give the stroke a color
  _path.strokeColor = 'black';
  var start = new paper.Point(100, 100);

  // Move to start and draw a line from there
  _path.moveTo(start);

  // Note that the plus operator on Point objects does not work
  // in JavaScript. Instead, we need to call the add() function:
  _path.lineTo(start.add([ 200, -50 ]));

  // Draw the view now:
  paper.view.draw();
*/
};

