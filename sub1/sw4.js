function debug(e, t) {
  t = t || {};
  var n = t.debug;
  n && console.log("[tt-sw] " + e)
}

function networkOnly(e, t, n) {
  return fetch(e)
}

function networkFirst(e, t, n) {
  n = n || {};
  var r = n.successResponses,
    o = n.networkTimeoutSeconds;
  return debug("Strategy: network first [" + e.url + "]", n), caches.open(n.cache.name).then(function(t) {
    var i, s, u = [];
    if (o) {
      var c = new Promise(function(n) {
        i = setTimeout(function() {
          t.match(e).then(function(e) {
            e && n(e)
          })
        }, 1e3 * o)
      });
      u.push(c)
    }
    var a = fetchAndCache(e, n).then(function(e) {
      if (i && clearTimeout(i), r.test(e.status)) return e;
      throw debug("Response was an HTTP error: " + e.statusText, n), s = e, new Error("Bad response")
    }).
    catch (function(r) {
      return debug("Network or response error, fallback to cache [" + e.url + "]", n), t.match(e).then(function(e) {
        if (e) return e;
        if (s) return s;
        throw r
      })
    });
    return u.push(a), Promise.race(u)
  })
}

function cacheOnly(e, t, n) {
  return debug("Strategy: cache only [" + e.url + "]", n), caches.open(n.cache.name).then(function(t) {
    return t.match(e)
  })
}

function cacheFirst(e, t, n) {
  return debug("Strategy: cache first [" + e.url + "]", n), caches.open(n.cache.name).then(function(t) {
    return t.match(e).then(function(t) {
      return t ? t : fetchAndCache(e, n)
    })
  })
}

function fetchAndCache(e, t) {
  t = t || {};
  var n = t.successResponses,
    r = t.cache.method;
  return fetch(e.clone()).then(function(o) {
    var i = (e.method + "").toLowerCase(),
      s = r.some(function(e) {
        if (i == e) return !0
      });
    return s && n.test(o.status) && caches.open(t.cache.name).then(function(t) {
      t.put(e, o)
    }), o.clone()
  })
}

function fastest(e, t, n) {
  return debug("Strategy: fastest [" + e.url + "]", n), new Promise(function(r, o) {
    var i = !1,
      s = [],
      u = function(e) {
        s.push(e.toString()), i ? o(new Error('Both cache and network failed: "' + s.join('", "') + '"')) : i = !0
      },
      c = function(e) {
        e instanceof Response ? r(e) : u("No result returned")
      };
    fetchAndCache(e.clone(), n).then(c, u), cacheOnly(e, t, n).then(c, u)
  })
}

function Route(e, t, n, r) {
  this.method = e, this.path = t, this.handler = n, this.options = r, t instanceof RegExp ? (this.type = 1, this.rule = t) : "string" == typeof t ? (this.type = 2, this.rule = pathRegexp(t, r)) : (this.type = 3, this.rule = null)
}

function Routes() {
  this.routes = new Map
}

function fetchListener(e, t) {
  var n = t.match(e.request);
  n ? e.respondWith(n(e.request)) : e.respondWith(fetch(e.request))
}

function activateListener(e, t) {
  debug("activate event fired"), e.waitUntil(caches.keys().then(function(e) {
    return Promise.all(e.map(function(e) {
      if (e !== t.cache.name) return caches.delete(e)
    }))
  }))
}

function installListener(e, t) {
  debug("install event fired"), e.waitUntil(caches.open(t.cache.name).then(function(e) {
    if (t.preCacheItems && t.preCacheItems.length > 0) return e.addAll(t.preCacheItems)
  }))
}
var scope;
scope = self.registration ? self.registration.scope : self.scope || new URL("./", self.location).href, function() {
  var e = Cache.prototype.addAll;
  e || (Cache.prototype.addAll = function(e) {
    function t(e) {
      this.name = "NetworkError", this.code = 19, this.message = e
    }
    var n = this;
    return t.prototype = Object.create(Error.prototype), Promise.resolve().then(function() {
      if (arguments.length < 1) throw new TypeError;
      return e = e.map(function(e) {
        return e instanceof Request ? e : String(e)
      }), Promise.all(e.map(function(e) {
        "string" == typeof e && (e = new Request(e));
        var n = new URL(e.url).protocol;
        if ("http:" !== n && "https:" !== n) throw new t("Invalid scheme");
        return fetch(e.clone())
      }))
    }).then(function(r) {
      if (r.some(function(e) {
        return !e.ok
      })) throw new t("Incorrect response status");
      return Promise.all(r.map(function(t, r) {
        return n.put(e[r], t)
      }))
    }).then(function() {})
  }, Cache.prototype.add = function(e) {
    return this.addAll([e])
  })
}(), function(e) {
  "use strict";

  function t(e, t) {
    function r(e) {
      return this && this.constructor === r ? (this._keys = [], this._values = [], this._itp = [], this.objectOnly = t, void(e && n.call(this, e))) : new r(e)
    }
    return t || m(e, "size", {
      get: l
    }), e.constructor = r, r.prototype = e, r
  }

  function n(e) {
    this.add ? e.forEach(this.add, this) : e.forEach(function(e) {
      this.set(e[0], e[1])
    }, this)
  }

  function r(e) {
    return this.has(e) && (this._keys.splice(g, 1), this._values.splice(g, 1), this._itp.forEach(function(e) {
      g < e[0] && e[0]--
    })), -1 < g
  }

  function o(e) {
    return this.has(e) ? this._values[g] : void 0
  }

  function i(e, t) {
    if (this.objectOnly && t !== Object(t)) throw new TypeError("Invalid value used as weak collection key");
    if (t != t || 0 === t) for (g = e.length; g-- && !v(e[g], t););
    else g = e.indexOf(t);
    return -1 < g
  }

  function s(e) {
    return i.call(this, this._keys, e)
  }

  function u(e, t) {
    return this.has(e) ? this._values[g] = t : this._values[this._keys.push(e) - 1] = t, this
  }

  function c() {
    (this._keys || 0).length = this._values.length = 0
  }

  function a() {
    return f(this._itp, this._keys)
  }

  function h() {
    return f(this._itp, this._values)
  }

  function p() {
    return f(this._itp, this._keys, this._values)
  }

  function f(e, t, n) {
    var r = [0],
      o = !1;
    return e.push(r), {
      next: function() {
        var i, s = r[0];
        return !o && s < t.length ? (i = n ? [t[s], n[s]] : t[s], r[0]++) : (o = !0, e.splice(e.indexOf(r), 1)), {
          done: o,
          value: i
        }
      }
    }
  }

  function l() {
    return this._values.length
  }

  function d(e, t) {
    for (var n = this.entries();;) {
      var r = n.next();
      if (r.done) break;
      e.call(t, r.value[1], r.value[0], this)
    }
  }
  var g, m = Object.defineProperty,
    v = function(e, t) {
      return e === t || e !== e && t !== t
    };
  "undefined" != typeof Map && "function" == typeof(new Map).values && (new Map).values().next || (e.Map = t({
    delete: r,
    has: s,
    get: o,
    set: u,
    keys: a,
    values: h,
    entries: p,
    forEach: d,
    clear: c
  }))
}("undefined" != typeof exports && "undefined" != typeof global ? global : "undefined" != typeof window ? window : self);
var pathRegexp = function() {
    function e(e, t) {
      for (var n, r = [], o = 0, u = 0, c = "", a = t && t.delimiter || "/"; null != (n = g.exec(e));) {
        var h = n[0],
          p = n[1],
          f = n.index;
        if (c += e.slice(u, f), u = f + h.length, p) c += p[1];
        else {
          var l = e[u],
            d = n[2],
            m = n[3],
            v = n[4],
            y = n[5],
            w = n[6],
            R = n[7];
          c && (r.push(c), c = "");
          var O = null != d && null != l && l !== d,
            b = "+" === w || "*" === w,
            E = "?" === w || "*" === w,
            k = n[2] || a,
            x = v || y;
          r.push({
            name: m || o++,
            prefix: d || "",
            delimiter: k,
            optional: E,
            repeat: b,
            partial: O,
            asterisk: !! R,
            pattern: x ? s(x) : R ? ".*" : "[^" + i(k) + "]+?"
          })
        }
      }
      return u < e.length && (c += e.substr(u)), c && r.push(c), r
    }

    function t(t, n) {
      return o(e(t, n))
    }

    function n(e) {
      return encodeURI(e).replace(/[\/?#]/g, function(e) {
        return "%" + e.charCodeAt(0).toString(16).toUpperCase()
      })
    }

    function r(e) {
      return encodeURI(e).replace(/[?#]/g, function(e) {
        return "%" + e.charCodeAt(0).toString(16).toUpperCase()
      })
    }

    function o(e) {
      for (var t = new Array(e.length), o = 0; o < e.length; o++)"object" == typeof e[o] && (t[o] = new RegExp("^(?:" + e[o].pattern + ")$"));
      return function(o, i) {
        for (var s = "", u = o || {}, c = i || {}, a = c.pretty ? n : encodeURIComponent, h = 0; h < e.length; h++) {
          var p = e[h];
          if ("string" != typeof p) {
            var f, l = u[p.name];
            if (null == l) {
              if (p.optional) {
                p.partial && (s += p.prefix);
                continue
              }
              throw new TypeError('Expected "' + p.name + '" to be defined')
            }
            if (d(l)) {
              if (!p.repeat) throw new TypeError('Expected "' + p.name + '" to not repeat, but received ~' + JSON.stringify(l) + "~");
              if (0 === l.length) {
                if (p.optional) continue;
                throw new TypeError('Expected "' + p.name + '" to not be empty')
              }
              for (var g = 0; g < l.length; g++) {
                if (f = a(l[g]), !t[h].test(f)) throw new TypeError('Expected all "' + p.name + '" to match "' + p.pattern + '", but received ~' + JSON.stringify(f) + "~");
                s += (0 === g ? p.prefix : p.delimiter) + f
              }
            } else {
              if (f = p.asterisk ? r(l) : a(l), !t[h].test(f)) throw new TypeError('Expected "' + p.name + '" to match "' + p.pattern + '", but received "' + f + '"');
              s += p.prefix + f
            }
          } else s += p
        }
        return s
      }
    }

    function i(e) {
      return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g, "\\$1")
    }

    function s(e) {
      return e.replace(/([=!:$\/()])/g, "\\$1")
    }

    function u(e, t) {
      return e.keys = t, e
    }

    function c(e) {
      return e.sensitive ? "" : "i"
    }

    function a(e, t) {
      var n = e.source.match(/\((?!\?)/g);
      if (n) for (var r = 0; r < n.length; r++) t.push({
        name: r,
        prefix: null,
        delimiter: null,
        optional: !1,
        repeat: !1,
        partial: !1,
        asterisk: !1,
        pattern: null
      });
      return u(e, t)
    }

    function h(e, t, n) {
      for (var r = [], o = 0; o < e.length; o++) r.push(l(e[o], t, n).source);
      var i = new RegExp("(?:" + r.join("|") + ")", c(n));
      return u(i, t)
    }

    function p(t, n, r) {
      return f(e(t, r), n, r)
    }

    function f(e, t, n) {
      d(t) || (n = t || n, t = []), n = n || {};
      for (var r = n.strict, o = n.end !== !1, s = "", a = 0; a < e.length; a++) {
        var h = e[a];
        if ("string" == typeof h) s += i(h);
        else {
          var p = i(h.prefix),
            f = "(?:" + h.pattern + ")";
          t.push(h), h.repeat && (f += "(?:" + p + f + ")*"), f = h.optional ? h.partial ? p + "(" + f + ")?" : "(?:" + p + "(" + f + "))?" : p + "(" + f + ")", s += f
        }
      }
      var l = i(n.delimiter || "/"),
        g = s.slice(-l.length) === l;
      return r || (s = (g ? s.slice(0, -l.length) : s) + "(?:" + l + "(?=$))?"), s += o ? "$" : r && g ? "" : "(?=" + l + "|$)", u(new RegExp("^" + s, c(n)), t)
    }

    function l(e, t, n) {
      return d(t) || (n = t || n, t = []), n = n || {}, e instanceof RegExp ? a(e, t) : d(e) ? h(e, t, n) : p(e, t, n)
    }
    var d = Array.isArray ||
    function(e) {
      return "[object Array]" == Object.prototype.toString.call(e)
    }, g = new RegExp(["(\\\\.)", "([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"), "g");
    return l.parse = e, l.compile = t, l.tokensToFunction = o, l.tokensToRegExp = f, l
  }();
Route.prototype.getMethod = function() {
  return this.method
}, Route.prototype.getPath = function() {
  return this.path
}, Route.prototype.getHandler = function() {
  return this.handler
}, Route.prototype.getOpts = function() {
  return this.options
}, Route.prototype.getType = function() {
  return this.type
}, Route.prototype.match = function(e) {
  return 3 != this.type && ((1 == this.type || 2 == this.type) && this.rule.test(e))
}, Route.prototype.getUrlParam = function(e) {
  if (2 == this.type) {
    var t = {},
      n = this.rule.exec(e),
      r = this.rule.keys;
    return r.forEach(function(e, r) {
      t[e.name] = n[r + 1]
    }), t
  }
  return null
}, Routes.prototype.add = function(e) {
  if (!e instanceof Route) return !1;
  var t = e.getType();
  if (3 == t) return !1;
  var n = e.getMethod().toLowerCase(),
    r = this.routes.get(n);
  r || (this.routes.set(n, []), r = this.routes.get(n)), r.push(e)
}, Routes.prototype.match = function(e) {
  return this.matchMethod(e.method, e.url) || this.matchMethod("any", e.url)
}, Routes.prototype.matchMethod = function(e, t) {
  function n(e, t) {
    if (!e) return null;
    for (var n = e.length - 1; n >= 0; --n) {
      var r = e[n];
      if (r.match(t)) return function(e) {
        var n = r.getOpts(),
          o = r.getHandler(),
          i = r.getUrlParam(t);
        for (var s in options)"undefined" == typeof n[s] && (n[s] = options[s]);
        return o(e, i, n)
      }
    }
    return null
  }
  e = (e + "").toLocaleLowerCase();
  var r = new URL(t),
    o = r.pathname;
  r.host != self.location.host && (o = t);
  var i = this.routes.get(e),
    s = n(i, o);
  return s ? s : null
};
var routes = new Routes,
  defaultOptions = {
    version: 0,
    cache: {
      name: "tt-sw-cache-" + scope,
      method: ["get"]
    },
    debug: !1,
    networkTimeoutSeconds: 5,
    preCacheItems: [],
    successResponses: /^0|([123]\d\d)|(40[14567])|410$/
  },
  tplOptions = {
    version: 2,
    cache: {
      name: "DOVE_AR"
    },
    preCacheItems: []
  },
  options = defaultOptions;
tplOptions && ("number" == typeof tplOptions.version && (options.version = tplOptions.version), tplOptions.cache && (tplOptions.cache.name && (options.cache.name = "tt-sw-cache-" + encodeURIComponent(tplOptions.cache.name) + "-" + options.version), tplOptions.cache.method && (options.cache.method = tplOptions.cache.method)), "boolean" == typeof tplOptions.debug && (options.debug = tplOptions.debug), "number" == typeof tplOptions.networkTimeoutSeconds && (options.networkTimeoutSeconds = tplOptions.networkTimeoutSeconds), tplOptions.preCacheItems && 0 != tplOptions.preCacheItems.length && (options.preCacheItems = tplOptions.preCacheItems), tplOptions.successResponses instanceof RegExp && (options.successResponses = tplOptions.successResponses));
var route = new Route("GET", "*", networkFirst, {});
routes.add(route), self.addEventListener("install", function(e) {
  installListener(e, options)
}), self.addEventListener("activate", function(e) {
  activateListener(e, options)
}), self.addEventListener("fetch", function(e) {
  fetchListener(e, routes)
});