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





/**
 * Each drawing is a composition of a strokes, managed by a sketch object
 *
 * @param db ueberDB database handle
 * @param id Sketch id, used for persistent storage
 * @param cb Will be invoked as soon as the sketch is initialized
 */
exports.sketch = function(db, id, cb) {

	var strokes = [];




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



	/* TODO Load strokes from database
	 */
	cb();
};

