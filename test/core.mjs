function _typeof(o) {
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
    return typeof o;
  } : function(o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

function deepEqual(a, b) {
  if (a === b) return !0;
  if (null === a || "object" !== _typeof(a) || null === b || "object" !== _typeof(b)) return !1;
  var keysA = Object.keys(a), keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return !1;
  for (var _i = 0, _keysA = keysA; _i < _keysA.length; _i++) {
    var key = _keysA[_i];
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return !1;
  }
  return !0;
}

function assert(truthy, message) {
  if (!truthy) throw new Error(message || "Assertion failed");
}

assert.ok = function(value, message) {
  if (!value) throw new Error(message || "Expected " + value + " to be truthy");
}, assert.equal = function(actual, expected, message) {
  if (actual !== expected) throw new Error(message || actual + " !== " + expected);
}, assert.deepEqual = function(actual, expected, message) {
  if (!deepEqual(actual, expected)) throw new Error(message || "Expected " + JSON.stringify(expected) + " but got " + JSON.stringify(actual));
};

var textStyle = {
  bold: 1,
  dim: 2,
  italic: 3,
  underline: 4,
  blink: 5,
  rapid: 6,
  inverse: 7,
  invisible: 8,
  strike: 9
}, fg$1 = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37
}, fgBright$1 = {
  black: 90,
  red: 91,
  green: 92,
  yellow: 93,
  blue: 94,
  magenta: 95,
  cyan: 96,
  white: 97
}, bg$1 = {
  black: 40,
  red: 41,
  green: 42,
  yellow: 43,
  blue: 44,
  magenta: 45,
  cyan: 46,
  white: 47
}, bgBright = {
  black: 100,
  red: 101,
  green: 102,
  yellow: 103,
  blue: 104,
  magenta: 105,
  cyan: 106,
  white: 107
}, style = {}, _loop$1 = function(i) {
  style[i] = function(txt) {
    return "[" + textStyle[i] + "m" + txt + "[0m";
  };
};

for (var i$2 in textStyle) _loop$1(i$2);

var color = {
  fg: {},
  fgBright: {},
  bg: {},
  bgBright: {}
}, _loop = function(i) {
  color.fg[i] = function(txt) {
    return "[" + fg$1[i] + "m" + txt + "[0m";
  }, color.fgBright[i] = function(txt) {
    return "[" + fgBright$1[i] + "m" + txt + "[0m";
  }, color.bg[i] = function(txt) {
    return "[" + bg$1[i] + "m" + txt + "[0m";
  }, color.bgBright[i] = function(txt) {
    return "[" + bgBright[i] + "m" + txt + "[0m";
  };
};

for (var i$1 in fg$1) _loop(i$1);

color.fg256 = function(n, text) {
  return "[38;5;" + n + "m" + text + "[0m";
}, color.bg256 = function(n, text) {
  return "[48;5;" + n + "m" + text + "[0m";
}, color.fgRGB = function(arr, txt) {
  return "[38;2;" + arr[0] + ";" + arr[1] + ";" + arr[2] + "m" + txt + "[0m";
}, color.bgRGB = function(arr, txt) {
  return "[48;2;" + arr[0] + ";" + arr[1] + ";" + arr[2] + "m" + txt + "[0m";
};

var escapeHtml_1, hasRequiredEscapeHtml, theme_normal = {
  black: "#000",
  red: "#ef476f",
  green: "#06d6a0",
  yellow: "#ffd166",
  blue: "#118ab2",
  magenta: "#8338ec",
  cyan: "#00b4d8",
  white: "#fff"
}, theme_bright = {
  black: "rgb(85,85,85)",
  red: "rgb(255,85,85)",
  green: "rgb(85,255,85)",
  yellow: "rgb(255,255,85)",
  blue: "rgb(85,85,255)",
  magenta: "rgb(255,85,255)",
  cyan: "rgb(85, 255, 255)",
  white: "rgb(255,255,255)"
}, css = {
  0: "all: initial"
};

for (var i in css[textStyle.bold] = "font-weight: 700", css[textStyle.dim] = "opacity: .8", 
css[textStyle.italic] = "font-style: italic", css[textStyle.underline] = "text-decoration: italic", 
css[textStyle.blink] = "", css[textStyle.rapid] = "", css[textStyle.inverse] = "filter: invert(100%)", 
css[textStyle.invisible] = "visibility: hidden", css[textStyle.strike] = "text-decoration: line-through", 
fg$1) css[fg$1[i]] = "color: " + theme_normal[i], css[fgBright$1[i]] = "color: " + theme_bright[i], 
css[bg$1[i]] = "background-color: " + theme_normal[i], css[bgBright[i]] = "background-color: " + theme_bright[i];

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}

var x, escapeHtmlExports = function() {
  if (hasRequiredEscapeHtml) return escapeHtml_1;
  hasRequiredEscapeHtml = 1;
  var matchHtmlRegExp = /["'&<>]/;
  return escapeHtml_1 = function(string) {
    var escape, str = "" + string, match = matchHtmlRegExp.exec(str);
    if (!match) return str;
    var html = "", index = 0, lastIndex = 0;
    for (index = match.index; index < str.length; index++) {
      switch (str.charCodeAt(index)) {
       case 34:
        escape = "&quot;";
        break;

       case 38:
        escape = "&amp;";
        break;

       case 39:
        escape = "&#39;";
        break;

       case 60:
        escape = "&lt;";
        break;

       case 62:
        escape = "&gt;";
        break;

       default:
        continue;
      }
      lastIndex !== index && (html += str.substring(lastIndex, index)), lastIndex = index + 1, 
      html += escape;
    }
    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
  }, escapeHtml_1;
}(), y = (x = escapeHtmlExports) && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x.default : x, e$1 = {
  black: "#2e3436",
  red: "#cc0000",
  green: "#4e9a06",
  yellow: "#c4a000",
  blue: "#3465a4",
  magenta: "#75507b",
  cyan: "#06989a",
  white: "#d3d7cf",
  "bright-black": "#555753",
  "bright-red": "#ef2929",
  "bright-green": "#8ae234",
  "bright-yellow": "#fce94f",
  "bright-blue": "#729fcf",
  "bright-magenta": "#ad7fa8",
  "bright-cyan": "#34e2e2",
  "bright-white": "#eeeeec"
};

function g() {
  var _ref$onlyFirst = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}).onlyFirst, l = void 0 !== _ref$onlyFirst && _ref$onlyFirst, r = [ "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?(?:\\u0007|\\u001B\\u005C|\\u009C))", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))" ].join("|");
  return new RegExp(r, l ? void 0 : "g");
}

var $ = /^(?:\x1b\[([\x3c-\x3f]?)([\d;]*)([\x20-\x2f]?[\x40-\x7e]))|(?:\x1b\[[\x20-\x7e]*([\x00-\x1f:]))/, p = /^\x1b\]8;[\x20-\x3a\x3c-\x7e]*;([\x21-\x7e]{0,512})(?:(?:\x1b\\)|(?:\x07))([\x20-\x7e]+)\x1b\]8;;(?:(?:\x1b\\)|(?:\x07))/, m = /(?:(\x1b\\)|(\x07))|([\x00-\x06]|[\x08-\x1a]|[\x1c-\x1f])/g, w = function(n) {
  this.lastIndex = 0, this.input = n;
};

w.prototype.next = function() {
  var n = this.input.substring(this.lastIndex), r = n.length;
  if (0 === r) return {
    value: null,
    done: !0
  };
  var t = {
    kind: 0,
    text: "",
    url: ""
  }, a = n.indexOf("");
  if (-1 === a) return t.kind = 1, t.text = n, this.lastIndex += r, {
    value: t,
    done: !1
  };
  if (a > 0) return t.kind = 1, t.text = n.slice(0, a), this.lastIndex += a, {
    value: t,
    done: !1
  };
  if (r < 3) return {
    value: null,
    done: !0
  };
  var s = n.charAt(1);
  if ("[" !== s && "]" !== s && "(" !== s) return t.kind = 2, t.text = n[0], this.lastIndex += 1, 
  {
    value: t,
    done: !1
  };
  if ("[" === s) {
    var o = n.match($);
    return null === o ? {
      value: null,
      done: !0
    } : o[4] ? (t.kind = 2, t.text = n[0], this.lastIndex += 1, {
      value: t,
      done: !1
    }) : ("" !== o[1] || "m" !== o[3] ? t.kind = 3 : t.kind = 4, t.text = o[2], this.lastIndex += o[0].length, 
    {
      value: t,
      done: !1
    });
  }
  if ("]" === s) {
    if (r < 4) return {
      value: null,
      done: !0
    };
    if ("8" !== n.charAt(2) || ";" !== n.charAt(3)) return t.kind = 2, t.text = n[0], 
    this.lastIndex += 1, {
      value: t,
      done: !1
    };
    var _o = new RegExp(m), d = _o.exec(n);
    if (null === d) return {
      value: null,
      done: !0
    };
    if (d[3]) return t.kind = 2, t.text = n[0], this.lastIndex += 1, {
      value: t,
      done: !1
    };
    var _d = _o.exec(n);
    if (null === _d) return {
      value: null,
      done: !0
    };
    if (_d[3]) return t.kind = 2, t.text = n[0], this.lastIndex += 1, {
      value: t,
      done: !1
    };
    var f = n.match(p);
    return null === f ? (t.kind = 2, t.text = n[0], this.lastIndex += 1, {
      value: t,
      done: !1
    }) : (t.kind = 5, t.url = f[1], t.text = f[2], this.lastIndex += f[0].length, {
      value: t,
      done: !1
    });
  }
  return "(" === s ? (t.kind = 3, this.lastIndex += 3, {
    value: t,
    done: !1
  }) : {
    value: null,
    done: !0
  };
}, w.prototype[Symbol.iterator] = function() {
  return this;
};

var h = new Array(14);

h[0] = "background-color", h[1] = "color", h[2] = "font-family", h[3] = "font-size", 
h[4] = "font-style", h[5] = "font-weight", h[6] = "opacity", h[7] = "outline", h[8] = "text-decoration", 
h[9] = "text-decoration-color", h[10] = "text-decoration-line", h[11] = "text-decoration-style", 
h[12] = "vertical-align", h[13] = "visibility";

var u = function() {
  this.attrArray = new Array(14), this._size = 0;
}, prototypeAccessors = {
  size: {
    configurable: !0
  }
};

u.prototype.get = function(n) {
  return this.attrArray[n];
}, u.prototype.set = function(n, r) {
  var t = this.attrArray[n];
  this.attrArray[n] = r, void 0 === t && void 0 !== r && (this._size += 1);
}, u.prototype.delete = function(n) {
  var r = this.attrArray[n];
  this.attrArray[n] = void 0, void 0 !== r && (this._size -= 1);
}, u.prototype.update = function(n) {
  for (var r in n) if (n.hasOwnProperty(r)) {
    var t = n[r];
    this.attrArray[r] = t, void 0 !== t && (this._size += 1);
  }
}, u.prototype.clear = function() {
  this.attrArray.fill(void 0), this._size = 0;
}, prototypeAccessors.size.get = function() {
  return this._size;
}, u.prototype.toString = function() {
  var n = "";
  return this.attrArray.forEach(function(r, t) {
    void 0 !== r && (n += h[t] + ":" + r + ";");
  }), n;
}, u.delete = function() {
  for (var arguments$1 = arguments, _len = arguments.length, n = new Array(_len), _key = 0; _key < _len; _key++) n[_key] = arguments$1[_key];
  return function(r) {
    n.forEach(function(t) {
      r.delete(t);
    });
  };
}, u.appendVal = function(n, r) {
  return function(t) {
    var a = t.get(n), s = a ? a.split(" ") : [];
    s.includes(r) || s.push(r), t.set(n, s.join(" "));
  };
}, u.removeVal = function(n, r) {
  return function(t) {
    var a = t.get(n), s = a ? a.split(" ") : [];
    (s = s.filter(function(o) {
      return o !== r;
    })).length ? t.set(n, s.join(" ")) : t.delete(n);
  };
}, Object.defineProperties(u.prototype, prototypeAccessors), g(), g({
  onlyFirst: !0
});

var e$2 = new Array(108);

e$2[0] = {
  5: "var(--ansi-bold-font-weight, 600)"
}, e$2[1] = {
  5: "var(--ansi-bold-font-weight, 600)"
}, e$2[2] = {
  6: "var(--ansi-dim-opacity, 0.7)"
}, e$2[3] = {
  4: "italic"
}, e$2[4] = u.appendVal(8, "underline"), e$2[8] = {
  13: "hidden"
}, e$2[9] = u.appendVal(8, "line-through"), e$2[10] = u.delete(2), e$2[11] = {
  2: "var(--ansi-font-1)"
}, e$2[12] = {
  2: "var(--ansi-font-2)"
}, e$2[13] = {
  2: "var(--ansi-font-3)"
}, e$2[14] = {
  2: "var(--ansi-font-4)"
}, e$2[15] = {
  2: "var(--ansi-font-5)"
}, e$2[16] = {
  2: "var(--ansi-font-6)"
}, e$2[17] = {
  2: "var(--ansi-font-7)"
}, e$2[18] = {
  2: "var(--ansi-font-8)"
}, e$2[19] = {
  2: "var(--ansi-font-9)"
}, e$2[21] = {
  10: "underline",
  11: "double"
}, e$2[22] = u.delete(5), e$2[23] = u.delete(4), e$2[24] = u.removeVal(8, "underline"), 
e$2[28] = u.delete(13), e$2[29] = u.removeVal(8, "line-through"), e$2[30] = {
  1: "var(--ansi-black, " + e$1.black + ")"
}, e$2[31] = {
  1: "var(--ansi-red, " + e$1.red + ")"
}, e$2[32] = {
  1: "var(--ansi-green, " + e$1.green + ")"
}, e$2[33] = {
  1: "var(--ansi-yellow, " + e$1.yellow + ")"
}, e$2[34] = {
  1: "var(--ansi-blue, " + e$1.blue + ")"
}, e$2[35] = {
  1: "var(--ansi-magenta, " + e$1.magenta + ")"
}, e$2[36] = {
  1: "var(--ansi-cyan, " + e$1.cyan + ")"
}, e$2[37] = {
  1: "var(--ansi-white, " + e$1.white + ")"
}, e$2[39] = u.delete(1), e$2[40] = {
  0: "var(--ansi-black, " + e$1.black + ")"
}, e$2[41] = {
  0: "var(--ansi-red, " + e$1.red + ")"
}, e$2[42] = {
  0: "var(--ansi-green, " + e$1.green + ")"
}, e$2[43] = {
  0: "var(--ansi-yellow, " + e$1.yellow + ")"
}, e$2[44] = {
  0: "var(--ansi-blue, " + e$1.blue + ")"
}, e$2[45] = {
  0: "var(--ansi-magenta, " + e$1.magenta + ")"
}, e$2[46] = {
  0: "var(--ansi-cyan, " + e$1.cyan + ")"
}, e$2[47] = {
  0: "var(--ansi-white, " + e$1.white + ")"
}, e$2[49] = u.delete(0), e$2[51] = {
  7: "var(--ansi-frame-outline, 1px solid)"
}, e$2[53] = u.appendVal(8, "overline"), e$2[54] = u.delete(7), e$2[55] = u.removeVal(8, "overline"), 
e$2[59] = u.delete(9), e$2[73] = {
  12: "super",
  3: "var(--ansi-superscript-font-size, 80%)"
}, e$2[74] = {
  12: "sub",
  3: "var(--ansi-subscript-font-size, 80%)"
}, e$2[75] = u.delete(12, 3), e$2[90] = {
  1: "var(--ansi-bright-black, " + e$1["bright-black"] + ")"
}, e$2[91] = {
  1: "var(--ansi-bright-red, " + e$1["bright-red"] + ")"
}, e$2[92] = {
  1: "var(--ansi-bright-green, " + e$1["bright-green"] + ")"
}, e$2[93] = {
  1: "var(--ansi-bright-yellow, " + e$1["bright-yellow"] + ")"
}, e$2[94] = {
  1: "var(--ansi-bright-blue, " + e$1["bright-blue"] + ")"
}, e$2[95] = {
  1: "var(--ansi-bright-magenta, " + e$1["bright-magenta"] + ")"
}, e$2[96] = {
  1: "var(--ansi-bright-cyan, " + e$1["bright-cyan"] + ")"
}, e$2[97] = {
  1: "var(--ansi-bright-white, " + e$1["bright-white"] + ")"
}, e$2[100] = {
  0: "var(--ansi-bright-black, " + e$1["bright-black"] + ")"
}, e$2[101] = {
  0: "var(--ansi-bright-red, " + e$1["bright-red"] + ")"
}, e$2[102] = {
  0: "var(--ansi-bright-green, " + e$1["bright-green"] + ")"
}, e$2[103] = {
  0: "var(--ansi-bright-yellow, " + e$1["bright-yellow"] + ")"
}, e$2[104] = {
  0: "var(--ansi-bright-blue, " + e$1["bright-blue"] + ")"
}, e$2[105] = {
  0: "var(--ansi-bright-magenta, " + e$1["bright-magenta"] + ")"
}, e$2[106] = {
  0: "var(--ansi-bright-cyan, " + e$1["bright-cyan"] + ")"
}, e$2[107] = {
  0: "var(--ansi-bright-white, " + e$1["bright-white"] + ")"
};

var c = new Array(16);

function b(l) {
  switch (l) {
   case "38":
    return 1;

   case "48":
    return 0;

   case "58":
    return 9;

   default:
    throw new Error("not implemented");
  }
}

c[0] = "black", c[1] = "red", c[2] = "green", c[3] = "yellow", c[4] = "blue", c[5] = "magenta", 
c[6] = "cyan", c[7] = "white", c[8] = "bright-black", c[9] = "bright-red", c[10] = "bright-green", 
c[11] = "bright-yellow", c[12] = "bright-blue", c[13] = "bright-magenta", c[14] = "bright-cyan", 
c[15] = "bright-white";

var el_tester, el_info_head, fancy = new (function() {
  function anonymous() {}
  return anonymous.prototype.toHtml = function(n) {
    var r = new u, t = "", a = !1;
    return Array.from(new w(n)).forEach(function(s) {
      switch (s.kind) {
       case 1:
        t += y(s.text);
        break;

       case 4:
        a && (t += "</span>", a = !1), function(l, n) {
          /^(38|48|58);(2|5);/.test(l.text) ? "2" === l.text[3] ? function(l, n) {
            var r = l.text.split(";");
            if (5 === r.length) {
              var t = b(r[0]), _r = function(r) {
                return function(r) {
                  if (Array.isArray(r)) return r;
                }(r) || function(r) {
                  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
                  if (null != t) {
                    var e, n, i, u, a = [], f = !0, o = !1;
                    try {
                      for (i = (t = t.call(r)).next; !(f = (e = i.call(t)).done) && (a.push(e.value), 
                      5 !== a.length); f = !0) ;
                    } catch (r$1) {
                      o = !0, n = r$1;
                    } finally {
                      try {
                        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
                      } finally {
                        if (o) throw n;
                      }
                    }
                    return a;
                  }
                }(r) || function(r) {
                  if (r) {
                    if ("string" == typeof r) return _arrayLikeToArray(r, 5);
                    var t = {}.toString.call(r).slice(8, -1);
                    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, 5) : void 0;
                  }
                }(r) || function() {
                  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                }();
              }(r), a = _r[2], s = _r[3], o = _r[4];
              n.set(t, "rgb(" + a + "," + s + "," + o + ")");
            }
          }(l, n) : function(l, n) {
            var r = l.text.split(";");
            if (3 === r.length) {
              var t = b(r[0]), a = parseInt(r[2], 10);
              if (0 <= a && a <= 15) {
                var s = c[a];
                n.set(t, "var(--ansi-" + s + ", " + e$1[s] + ")");
              } else if (16 <= a && a <= 231) {
                var _s = a - 16, o = [ 0, 95, 135, 175, 215, 255 ], f = o[_s / 36 % 6 | 0], d = o[_s / 6 % 6 | 0], v = o[_s % 6];
                n.set(t, "rgb(" + f + "," + d + "," + v + ")");
              } else if (232 <= a && a <= 255) {
                var _s2 = 8 + 10 * (a - 232);
                n.set(t, "var(--ansi-gray-" + (256 - a) + ", rgb(" + _s2 + "," + _s2 + "," + _s2 + "))");
              }
            }
          }(l, n) : l.text.split(";").forEach(function(r) {
            var t = parseInt(r || "0", 10);
            if (0 !== t) {
              var a = e$2[t];
              a && ("function" == typeof a ? a(n) : n.update(a));
            } else n.clear();
          });
        }(s, r), r.size && (t += '<span style="' + r.toString() + '">', a = !0);
      }
    }), a && (t += "</span>"), t;
  }, anonymous;
}()), html = function(str) {
  return fancy.toHtml(str);
}, e = "undefined" != typeof window, r = "undefined" != typeof importScripts, o = {
  browser: e,
  cli: !e && !r
}, fg = color.fg, bg = color.bg, fgBright = color.fgBright, cli = o.cli, browser = o.browser;

browser && ((el_tester = document.createElement("div")).className = "tester-runner", 
"test_runner_container" in window ? test_runner_container.appendChild(el_tester) : document.body.appendChild(el_tester));

var Test = {
  report: [],
  result: {
    passed: 0,
    failed: 0
  },
  add: function(name, fn) {
    this.report.push({
      name: name,
      fn: fn
    });
  },
  run: function() {
    if (this.result = {
      passed: 0,
      failed: 0
    }, browser) {
      var el_group = document.createElement("div");
      el_group.className = "tester-runner__group", el_tester.appendChild(el_group);
      var el_test_head = document.createElement("div");
      el_test_head.className = "tester-runner__group--head", el_test_head.innerHTML += html(style.underline("Test")), 
      el_group.appendChild(el_test_head);
    }
    cli && console.group("\n" + style.underline("Test") + "\n");
    for (var i = 0; i < this.report.length; i++) {
      var test = this.report[i];
      if (browser) {
        var el_test = document.createElement("div");
        el_test.className = "tester-runner__group--test", el_group.appendChild(el_test);
      }
      try {
        test.fn(), this.result.passed++, cli && console.log(fg.green("√") + " " + fg.blue(test.name)), 
        browser && (el_test.innerHTML += html(fg.green("√") + " " + fg.blue(test.name)));
      } catch (e) {
        if (this.result.failed++, cli && (console.log(fgBright.red("×") + " " + fgBright.red(test.name)), 
        console.groupCollapsed(), console.log(fgBright.black(e.message)), console.groupEnd()), 
        browser) {
          el_test.innerHTML += html(fgBright.red("×") + " " + fgBright.red(test.name));
          var el_test_sub = document.createElement("div");
          el_test_sub.className = "tester-runner__group--test__sub", el_test_sub.innerHTML += html(fgBright.black(e.message)), 
          el_test.appendChild(el_test_sub);
        }
      }
    }
    if (cli && (console.groupEnd(), console.group("\n" + style.underline("Result") + "\n"), 
    console.info(bg.green(fgBright.white(" " + this.result.passed + " ")) + " " + fg.green("passed") + ", " + bg.red(fgBright.white(" " + this.result.failed + " ")) + " " + fgBright.red("failed")), 
    console.groupEnd()), browser) {
      var el_info = document.createElement("div");
      el_info.className = "tester-runner__info", el_tester.appendChild(el_info), (el_info_head = document.createElement("div")).className = "tester-runner__info--head", 
      el_info_head.innerHTML = html(style.underline("Result")), el_info.appendChild(el_info_head);
      var el_info_result = document.createElement("div");
      el_info_result.className = "tester-runner__info--result", el_info_result.innerHTML = html(bg.green(fgBright.white(" " + this.result.passed + " ")) + " " + fg.green("passed") + ", " + bg.red(fgBright.white(" " + this.result.failed + " ")) + " " + fgBright.red("failed")), 
      el_info.appendChild(el_info_result);
    }
    cli && this.result.failed > 0 && process.exit(1);
  }
}, runner = Object.freeze({
  __proto__: null,
  it: function(name, fn) {
    Test.add(name, fn);
  },
  run: function() {
    Test.run();
  }
});

function type(val) {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
}

function object_(input) {
  return "object" === type(input) ? (object_.core.value = input, object_.core) : String(input);
}

function array_(input) {
  return "array" === type(input) ? (array_.core.value = input, array_.core) : String(input);
}

function string_(input) {
  return "string" === type(input) ? (string_.core.value = input, string_.core) : String(input);
}

function number_(input) {
  return "number" === type(input) ? (number_.core.value = input, number_.core) : String(input);
}

object_.core = {
  value: void 0,
  extend: function(o) {
    for (var i in o) this[i] = o[i];
    return this;
  }
}, object_.expose = function(obj) {
  var arr = function(obj) {
    for (var props = new Set, current = obj; current; ) Object.getOwnPropertyNames(current).forEach(function(prop) {
      return props.add(prop);
    }), current = Object.getPrototypeOf(current);
    return Array.from(props);
  }(obj), methods = [], properties = [];
  for (var i in arr) "function" === type(obj[arr[i]]) ? methods.push(arr[i]) : properties.push(arr[i]);
  return {
    methods: methods,
    properties: properties
  };
}, object_.createEvents = function(obj) {
  "object" === type(obj) && Object.defineProperty(obj, "events", {
    value: {
      create: [],
      rename: [],
      update: [],
      delete: []
    },
    configurable: !0
  });
}, object_.core.extend({
  select: function(str) {
    return obj = this.value, str.split(".").reduce(function(o, prop) {
      return o && o.hasOwnProperty(prop) ? o[prop] : void 0;
    }, obj);
    var obj;
  }
}), object_.core.extend({
  forEach: function(cb) {
    if ("function" == typeof cb) for (var i in this.value) cb(i, this.value[i]);
  }
}), object_.core.extend({
  hasProperty: function(search) {
    var bool = !1;
    for (var i in search = search.toString(), this.value) if (i === search) {
      bool = !0;
      break;
    }
    return bool;
  }
}), object_.core.extend({
  addEventListener: function(name, cb) {
    cb && this.value.events && this.value.events[name].push(cb);
  }
}), object_.core.extend({
  removeEventListener: function(name, fname) {
    if (!this.value.events || !name) return !1;
    if (fname || 0 === fname) {
      var events = this.value.events[name], a = [];
      if (0 === fname || "number" == typeof fname) {
        for (i in events) fname !== parseInt(i) && a.push(events[i]);
        this.value.events[name] = a;
      }
      if ("string" == typeof fname) {
        for (var i in events) events[i].name !== fname && a.push(events[i]);
        this.value.events[name] = a;
      }
    } else this.value.events[name] = [];
  }
}), object_.core.extend({
  createProperty: function(key, val) {
    if (!this.hasProperty(key) && (this.value[key] = val, this.value.events)) {
      var events = this.value.events.create;
      if (void 0 !== events && events.length > 0) for (var i in events) events[i].call(!1, key, val);
    }
  }
}), object_.core.extend({
  renameProperty: function(from, to) {
    if (this.hasProperty(from) && !this.hasProperty(to)) {
      for (var i in this.value) i === from && (this.value[to] = this.value[from], delete this.value[from]);
      if (this.value.events) {
        var events = this.value.events.rename;
        if (void 0 !== events && events.length > 0) for (var i in events) events[i].call(!1, from, to);
      }
    }
  }
}), object_.core.extend({
  updateProperty: function(key, value) {
    if (this.hasProperty(key) && (this.value[key] = value), this.value.events) {
      var events = this.value.events.update;
      if (void 0 !== events && events.length > 0) for (var i in events) events[i].call(!1, key, value);
    }
  }
}), object_.core.extend({
  deleteProperty: function(key) {
    if (this.hasProperty(key) && delete this.value[key], this.value.events) {
      var events = this.value.events.delete;
      if (void 0 !== events && events.length > 0) for (var i in events) events[i].call(!1, key);
    }
  }
}), object_.core.extend({
  template: function(str) {
    return function(obj, input) {
      for (var match, re = /{%(.+?)%}/g, reExp = /(^( )?(let|if|for|else|switch|case|break|{|}))(.*)?/g, code = "let r=[];\n", cursor = 0, _add = function(line, js) {
        return code += js ? line.match(reExp) ? line + "\n" : "r.push(" + line + ");\n" : "" != line ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : "", 
        _add;
      }; match = re.exec(input); ) _add(input.slice(cursor, match.index))(match[1], !0), 
      cursor = re.lastIndex;
      return _add(input.substr(cursor, input.length - cursor)), code += 'return r.join("");', 
      new Function(code.replace(/[\r\t\n]/g, "")).apply(obj);
    }(this.value, str);
  }
}), array_.core = {
  value: void 0,
  extend: function(o) {
    for (var i in o) this[i] = o[i];
    return this;
  }
}, array_.createEvents = function(arr) {
  "array" === type(arr) && Object.defineProperty(arr, "events", {
    value: {
      create: [],
      update: [],
      delete: []
    },
    configurable: !0
  });
}, array_.core.extend({
  forEach: object_.core.forEach
}), array_.core.extend({
  addEventListener: object_.core.addEventListener
}), array_.core.extend({
  removeEventListener: object_.core.removeEventListener
}), array_.core.extend({
  create: function(val, pos) {
    if (pos || 0 === pos) if ("string" === type(pos)) if ("first" === pos) this.value.unshift(val); else {
      if ("last" !== pos) return;
      this.value.push(val);
    } else {
      if ("number" !== type(pos)) return;
      this.value.splice(pos, 0, val);
    } else this.value.push(val);
    if (this.value.events) {
      var events = this.value.events.create;
      if (void 0 !== events && events.length > 0) for (var i in events) events[i].call(!1, val, pos);
    }
  }
}), array_.core.extend({
  update: function(from, to, pos) {
    if ((from || 0 === from) && (to || 0 === to)) {
      var i, l = this.value.length;
      if (pos || 0 === pos) for (i = 0; i < l; i++) i === pos && this.value[i] === from && (this.value[i] = to); else for (i = 0; i < l; i++) this.value[i] === from && (this.value[i] = to);
      if (this.value.events) {
        var events = this.value.events.update;
        if (void 0 !== events && events.length > 0) for (i in events) events[i].call(!1, from, to, pos);
      }
    }
  }
}), array_.core.extend({
  delete: function(val, pos) {
    if (val || 0 === val) {
      var l = this.value.length;
      if (pos || 0 === pos) for (i = 0; i < l; i++) i === pos && this.value[i] === val && this.value.splice(i, 1); else for (i = 0; i < l; i++) this.value[i] === val && this.value.splice(i, 1);
      if (this.value.events) {
        var events = this.value.events.delete;
        if (void 0 !== events && events.length > 0) for (i in events) events[i].call(!1, val, pos);
      }
    } else {
      var i;
      if (l = this.value.length, pos || 0 === pos) for (i = 0; i < l; i++) i === pos && this.value.splice(i, 1); else for (i = 0; i < l; i++) this.value.splice(i, 1);
    }
  }
}), string_.core = {
  value: void 0,
  extend: function(o) {
    for (var i in o) this[i] = o[i];
    return this;
  }
}, string_.escapeHtml = function(str, reverse) {
  return void 0 === reverse && (reverse = !1), reverse ? function(str) {
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, function(m) {
      return {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'"
      }[m];
    });
  }(str) : function(str) {
    return str.replace(/[&<>"']/g, function(m) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[m];
    });
  }(str);
}, string_.stripInitial = function(str) {
  var indentLen = str.match(/^\s*(?=[^\s]+)/gm).reduce(function(min, line) {
    return Math.min(min, line.length);
  }, 1 / 0), indent = new RegExp("^\\s{" + indentLen + "}", "mg");
  return indentLen > 0 ? str.replace(indent, "") : str;
}, string_.formatHTML = function(str_html, tab) {
  void 0 === tab && (tab = "  ");
  var result = "", indent = "";
  return str_html.split(/>\s*</).forEach(function(element) {
    element.match(/^\/\w/) && (indent = indent.substring(tab.length)), result += indent + "<" + element + ">\r\n", 
    element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input") && (indent += tab);
  }), result.substring(1, result.length - 3);
}, string_.escapeQuote = function(str) {
  var map = {
    '"': '"',
    "'": "\\'"
  };
  return str.replace(/"|'/g, function(m) {
    return map[m];
  });
}, string_.toUpperFirst = function(str) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}, string_.urlEncode = function(str, reverse) {
  return void 0 === reverse && (reverse = !1), reverse ? decodeURIComponent(str) : encodeURIComponent(str).replace(/!/g, "%21").replace(/~/g, "%7E").replace(/\*/g, "%2A").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%20/g, "+");
}, string_.core.extend({
  splice: function(pos, length, replace) {
    return length = +length || 0, replace = replace || "", this.value.slice(0, pos) + replace + this.value.slice(pos + length);
  }
}), number_.core = {
  value: void 0,
  extend: function(o) {
    for (var i in o) this[i] = o[i];
    return this;
  }
}, number_.bytes = function(num, unit) {
  return void 0 === unit && (unit = !1), unit ? function(num, size) {
    var k = 1024, n = 0;
    return "KB" === size && (n = num * k), "MB" === size && (n = num * (k * k)), "GB" === size && (n = num * (k * k * k)), 
    "TB" === size && (n = num * (k * k * k * k)), "PB" === size && (n = num * (k * k * k * k * k)), 
    "EB" === size && (n = num * (k * k * k * k * k * k)), "ZB" === size && (n = num * (k * k * k * k * k * k * k)), 
    "YB" === size && (n = num * (k * k * k * k * k * k * k * k)), parseInt(n);
  }(num, unit) : function(num, decimals) {
    if (void 0 === decimals && (decimals = 2), 0 === num) return "0 Bytes";
    var dm = decimals < 0 ? 0 : decimals, i = Math.floor(Math.log(num) / Math.log(1024));
    return parseFloat((num / Math.pow(1024, i)).toFixed(dm)) + " " + [ "Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ][i];
  }(num);
};

export { array_, assert, number_, object_, string_, runner as test, type };
