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
 * Each drawing is a composition of a strokes, managed by a sketch object
 *
 * @param db ueberDB database handle
 * @param id Sketch id, used for persistent storage
 * @param cb Will be invoked as soon as the sketch is initialized
 *
 * @warning Absolute authority over the sketch is assumed. Multiple processes
 *     accessing the same sketch will result in manslaughter
 */
exports.Sketch = function(db, id, cb) {

  /**
   * Strokes stored on persistent medium
   */
  var strokes = [];

  /**
   * Volatile stroke information cache, consisting of a mapping from
   * session id to the first stroke index not yet send to the client
   *
   * This object can be pruned at any time, which will cause all clients
   * to receive the hole sketch (which does not do any harm, since the
   * clients are aware of which strokes they already have received)
   */
  var cache = {};





  /**
   * Appends a new stroke to the sketch
   *
   * @param stroke Stroke to append, will be sanity checked inside
   */
  this.append = function(stroke) {
    
    /* TODO Add sanity checks
     */
    strokes.push(stroke);
  };



  /**
   * Returns all strokes to be send to a session
   *
   * @warning Calling this method without ensuring the client receives all
   *     strokes will cause the client to miss some
   */
  this.updates = function(session) {

    /* Information cache populated?
     */
    var index = cache.hasOwnProperty(session)
        ? cache[session]
        : 0
    ;
    cache[session] = strokes.length;

    /* Retrieve subset of strokes
     */
    return strokes.slice(index);
  };





  /* TODO Load strokes from database
   */
  cb.apply(this, []);
};

