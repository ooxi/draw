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
//    _path.fillColor = 'black'; //new paper.RgbColor(0.42745098039215684, 0.28627450980392155, 0.1450980392156863, 0.7843137254901961);
    _path.strokeColor = new paper.RgbColor(0.42745098039215684, 0.28627450980392155, 0.1450980392156863, 0.7843137254901961);
    _path.add(event.point);
    paper.view.draw();

    // The data we will send every 100ms
    _stroke = {
        rgba: {"red":0.42745098039215684,"green":0.28627450980392155,"blue":0.1450980392156863,"opacity":0.7843137254901961},
        start: event.point,
        path: []
    };

    // Send paths every 100ms
    _timer = _timer || setInterval(function () {
      _io.emit('etherdraw:progress', JSON.stringify(_stroke));
      _stroke.path = [];
    }, 100);
  };



  _tool.onMouseDrag = function(event) {
    var step = {
        x: event.delta.x / 2,
        y: event.delta.y / 2
    };
//    step.angle += 90;

    var top = {
        x: event.middlePoint.x + step.x,
        y: event.middlePoint.y + step.y
    };
    var bottom = {
        x: event.middlePoint.x - step.x,
        y: event.middlePoint.y - step.y
    };

    _path.add(top);
    _path.insert(0, bottom);
    _path.smooth();
    paper.view.draw();

    // Add data to path
    _stroke.path.push({
        top: top,
        bottom: bottom
    });
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

};

