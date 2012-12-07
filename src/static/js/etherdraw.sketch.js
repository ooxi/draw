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
   * Establish backend connection
   */
  var _io = io.connect('/');

  /**
   * Initialize canvas
   */
  paper.setup(canvas);
  var _path = new paper.Path();



  /* Register callbacks as soon as connection is established
   */
  _io.on('connection', function(socket) {
    _io.emit('etherdraw.join', id);
    cb();
  });













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

