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
 * Miscellaneous utility functions
 */
EtherDraw = EtherDraw || {};

EtherDraw.Util = EtherDraw.Util || {

  /**
   * Extracts sketch identifier from URL
   *
   * @param url String An URL like http://draw.etherpad.org/d/my-sketch
   * @return Sketch identifier, in the example aboth `my-skety'
   */
  getIdentifierFromUrl: function(url) {
    url = ''+ url;
    var lastSlash = url.lastIndexOf('/');

    if (-1 === lastSlash) {
      throw 'Cannot extract sketch identifier';
    }
    return url.substring(lastSlash);
  }




};

