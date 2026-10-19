/* ES5 shims for the few runtime APIs the legacy bundle needs.
 *
 * Injected only into dist/router.legacy.js (rollup output.intro). Every shim is
 * guarded, so an engine or a consumer polyfill that already provides the API is
 * left untouched. Syntax stays ES5 on purpose: this file is parsed by the same
 * engines the legacy bundle targets.
 */
(function (global) {
  'use strict';

  // Only the iterator key is needed; the rest of Symbol stays absent.
  if (typeof global.Symbol === 'undefined') {
    global.Symbol = { iterator: '@@iterator' };
  }

  if (typeof global.Map === 'undefined') {
    var indexOf = function (list, value) {
      for (var i = 0; i < list.length; i++) {
        if (list[i] === value) return i;
      }
      return -1;
    };

    function Map(entries) {
      this._keys = [];
      this._values = [];
      if (entries) {
        for (var i = 0; i < entries.length; i++) this.set(entries[i][0], entries[i][1]);
      }
    }

    Map.prototype.set = function (key, value) {
      var index = indexOf(this._keys, key);
      if (index === -1) {
        this._keys.push(key);
        this._values.push(value);
      } else {
        this._values[index] = value;
      }
      return this;
    };

    Map.prototype.get = function (key) {
      var index = indexOf(this._keys, key);
      return index === -1 ? undefined : this._values[index];
    };

    Map.prototype.has = function (key) {
      return indexOf(this._keys, key) !== -1;
    };

    Map.prototype['delete'] = function (key) {
      var index = indexOf(this._keys, key);
      if (index === -1) return false;
      this._keys.splice(index, 1);
      this._values.splice(index, 1);
      return true;
    };

    Map.prototype.clear = function () {
      this._keys.length = 0;
      this._values.length = 0;
    };

    Object.defineProperty(Map.prototype, 'size', {
      get: function () {
        return this._keys.length;
      }
    });

    Map.prototype['@@iterator'] = function () {
      var keys = this._keys;
      var values = this._values;
      var index = 0;
      return {
        next: function () {
          if (index >= keys.length) return { value: undefined, done: true };
          var pair = [keys[index], values[index]];
          index++;
          return { value: pair, done: false };
        }
      };
    };

    Map.prototype[global.Symbol.iterator] = Map.prototype['@@iterator'];

    global.Map = Map;
  }

  if (typeof global.Object.entries === 'undefined') {
    global.Object.entries = function (object) {
      var result = [];
      for (var key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) result.push([key, object[key]]);
      }
      return result;
    };
  }

  if (typeof global.Array.from === 'undefined') {
    global.Array.from = function (value) {
      var result = [];
      if (value && typeof value.length === 'number') {
        for (var i = 0; i < value.length; i++) result.push(value[i]);
        return result;
      }
      var iterator = value && value[global.Symbol.iterator];
      if (!iterator) return result;
      var step;
      var walker = iterator.call(value);
      while (!(step = walker.next()).done) result.push(step.value);
      return result;
    };
  }

  if (typeof global.String.prototype.startsWith === 'undefined') {
    global.String.prototype.startsWith = function (search, position) {
      var at = position || 0;
      return this.slice(at, at + String(search).length) === String(search);
    };
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this);
