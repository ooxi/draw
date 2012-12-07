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

  /**
   * Initialize paper.js tool
   *
   * TODO I have no idea what minDistance and maxDistance are doing
   */
  var _tool = new paper.Tool();
  _tool.minDistance = 10;
  _tool.maxDistance = 45;

  /**
   * Temporary objects containing state about the stroke the user is currently
   * commiting
   */
    var _path = null;
  var _stroke = null;
  var _timer = null;





  /* Register socket.io callbacks as soon as connection is established
   */
  _io.on('connect', function(socket) {
    _io.emit('etherdraw.join', id);
    cb();
  });




  /* Register paper.js handler
   */
  _tool.onMouseDown = function(event) {
    _path = new paper.Path();
    _path.fillColor = {"red":0.42745098039215684,"green":0.28627450980392155,"blue":0.1450980392156863,"opacity":0.7843137254901961};
    _path.add(event.point);
    paper.view.draw();

    // The data we will send every 100ms on mouse drag
    _stroke = {
        rgba: {"red":0.42745098039215684,"green":0.28627450980392155,"blue":0.1450980392156863,"opacity":0.7843137254901961},
        start: event.point,
        path: []
    };
  };



  _tool.onMouseDrag = function(event) {
    var step = event.delta / 2;
    step.angle += 90;

    var top = event.middlePoint + step;
    var bottom = event.middlePoint - step;

    _path.add(top);
    _path.insert(0, bottom);
    _path.smooth();
    paper.view.draw();

    // Add data to path
    _stroke.path.push({
        top: top,
        bottom: bottom
    });

    // Send paths every 100ms
    _timer = _timer || setInterval(function () {
      _io.emit('etherdraw:progress', JSON.stringify(_stroke));
      _stroke.path = [];
    }, 100);
  };



  _tool.onMouseUp = function(event) {

    // Close the users path
    _path.add(event.point);
    _path.closed = true;
    _path.smooth();
    paper.view.draw();

    // Send the path to other users
    _stroke.end = event.point;
    _io.emit('etherdraw:end', JSON.stringify(_stroke));

    // Stop new path data being added & sent
    clearInterval(_timer);
    _timer = null;
    _stroke = null;
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

