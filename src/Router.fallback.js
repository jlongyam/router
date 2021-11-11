function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Router = /*#__PURE__*/function () {
  "use strict";

  function Router() {
    var _this = this;

    var map = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Router);

    this.map = map;
    window.addEventListener('hashchange', function () {
      return _this._hash;
    });
    if (window.location.hash.length > 0) return this._hash;
  }

  _createClass(Router, [{
    key: "_exec",
    value: function _exec(hash, ahash, amap) {
      var maps = Object.keys(this.map);

      for (var i = 0; i < maps.length; i++) {
        if (maps[i] === hash) {
          if (typeof ahash != 'undefined') {
            var args = ':' + amap.join('/:');
            this.map[hash + args].apply(null, ahash);
          } else this.map[hash].apply();
        }
      }
    }
  }, {
    key: "_sort",
    value: function _sort(match, hash) {
      for (var i = 0; i < match.length; i++) {
        var map = match[i]['map'];
        var tail = hash.substring(map.length);
        var arg = match[i]['variable'];

        if (tail.length === 0) {
          if (arg.length === 0) this._exec(map);
        } else {
          if (arg.length > 0) {
            var hash_no_tail = tail.substring(0, tail.length - 1);
            var a_hash = hash_no_tail.split('/');
            if (a_hash.length === arg.length) this._exec(map, a_hash, arg);
          }
        }
      }
    }
  }, {
    key: "_map",
    get: function get() {
      var maps = Object.keys(this.map);
      var a = [];

      for (var i = 0; i < maps.length; i++) {
        var hashs = maps[i].split(':');
        var base = hashs[0];
        var normalize = base.substring(base.length - 1) != '/' ? base + '/' : base;
        var vars = [];

        for (var u = 0; u < hashs.length; u++) {
          if (hashs[u] === base) continue;
          vars.push(hashs[u].replace('/', ''));
        }

        a.push({
          hash: maps[i],
          base: normalize,
          variable: vars
        });
      }

      return a;
    }
  }, {
    key: "_hash",
    get: function get() {
      var hash = decodeURI(window.location.hash);
      var tail = hash.substring(hash.length, hash.length - 1);
      var normalize = tail === '/' ? hash : hash + '/';
      var a = [];

      for (var i = 0; i < this._map.length; i++) {
        var base = this._map[i]['base'];

        if (normalize.indexOf(base) != -1) {
          a.push({
            map: base,
            variable: this._map[i]['variable']
          });
        }
      }

      this._sort(a, normalize);

      return {
        hash: hash,
        normalize: normalize,
        match: a
      };
    }
  }]);

  return Router;
}();
