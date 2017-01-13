function debug(e,t){t=t||{};var n=t.debug;n&&console.log("[tt-sw] "+e)}function networkOnly(e,t,n){return fetch(e)}function networkFirst(e,t,n){n=n||{};var r=n.successResponses,o=n.networkTimeoutSeconds;return debug("Strategy: network first ["+e.url+"]",n),caches.open(n.cache.name).then(function(t){var s,i,c=[];if(o){var u=new Promise(function(n){s=setTimeout(function(){t.match(e).then(function(e){e&&n(e)})},1e3*o)});c.push(u)}var a=fetchAndCache(e,n).then(function(e){if(s&&clearTimeout(s),r.test(e.status))return e;throw debug("Response was an HTTP error: "+e.statusText,n),i=e,new Error("Bad response")}).catch(function(r){return debug("Network or response error, fallback to cache ["+e.url+"]",n),t.match(e).then(function(e){if(e)return e;if(i)return i;throw r})});return c.push(a),Promise.race(c)})}function cacheOnly(e,t,n){return debug("Strategy: cache only ["+e.url+"]",n),caches.open(n.cache.name).then(function(t){return t.match(e)})}function cacheFirst(e,t,n){return debug("Strategy: cache first ["+e.url+"]",n),caches.open(n.cache.name).then(function(t){return t.match(e).then(function(t){return t?t:fetchAndCache(e,n)})})}function fetchAndCache(e,t){t=t||{};var n=t.successResponses,r=t.cache.method;return fetch(e.clone()).then(function(o){var s=(e.method+"").toLowerCase(),i=r.some(function(e){if(s==e)return!0});return i&&n.test(o.status)&&caches.open(t.cache.name).then(function(t){t.put(e,o)}),o.clone()})}function fastest(e,t,n){return debug("Strategy: fastest ["+e.url+"]",n),new Promise(function(r,o){var s=!1,i=[],c=function(e){i.push(e.toString()),s?o(new Error('Both cache and network failed: "'+i.join('", "')+'"')):s=!0},u=function(e){e instanceof Response?r(e):c("No result returned")};fetchAndCache(e.clone(),n).then(u,c),cacheOnly(e,t,n).then(u,c)})}function Route(e,t,n,r){this.method=e,this.path=t,this.handler=n,this.options=r,t instanceof RegExp?(this.type=1,this.rule=t):"string"==typeof t?(this.type=2,this.rule=pathRegexp(t,r)):(this.type=3,this.rule=null)}function Routes(){this.routes=new Map}function fetchListener(e,t){var n=t.match(e.request);n?e.respondWith(n(e.request)):e.respondWith(fetch(e.request))}function activateListener(e,t){debug("activate event fired"),e.waitUntil(caches.keys().then(function(e){return Promise.all(e.map(function(e){if(e!==t.cache.name)return caches.delete(e)}))})),t.mainResUrl&&caches.open(t.cache.name).then(function(e){var t=["fetchMode=1"],n=new Blob(t);return e.put(mainResUrl,new Response(n))})}function installListener(e,t){debug("install event fired"),e.waitUntil(caches.open(t.cache.name).then(function(e){if(t.preCacheItems&&t.preCacheItems.length>0)return e.addAll(t.preCacheItems)}))}var scope;scope=self.registration?self.registration.scope:self.scope||new URL("./",self.location).href,function(){var e=Cache.prototype.addAll;e||(Cache.prototype.addAll=function(e){function t(e){this.name="NetworkError",this.code=19,this.message=e}var n=this;return t.prototype=Object.create(Error.prototype),Promise.resolve().then(function(){if(arguments.length<1)throw new TypeError;return e=e.map(function(e){return e instanceof Request?e:String(e)}),Promise.all(e.map(function(e){"string"==typeof e&&(e=new Request(e));var n=new URL(e.url).protocol;if("http:"!==n&&"https:"!==n)throw new t("Invalid scheme");return fetch(e.clone())}))}).then(function(r){if(r.some(function(e){return!e.ok}))throw new t("Incorrect response status");return Promise.all(r.map(function(t,r){return n.put(e[r],t)}))}).then(function(){})},Cache.prototype.add=function(e){return this.addAll([e])})}(),function(e){"use strict";function t(e,t){function r(e){return this&&this.constructor===r?(this._keys=[],this._values=[],this._itp=[],this.objectOnly=t,void(e&&n.call(this,e))):new r(e)}return t||v(e,"size",{get:f}),e.constructor=r,r.prototype=e,r}function n(e){this.add?e.forEach(this.add,this):e.forEach(function(e){this.set(e[0],e[1])},this)}function r(e){return this.has(e)&&(this._keys.splice(m,1),this._values.splice(m,1),this._itp.forEach(function(e){m<e[0]&&e[0]--})),-1<m}function o(e){return this.has(e)?this._values[m]:void 0}function s(e,t){if(this.objectOnly&&t!==Object(t))throw new TypeError("Invalid value used as weak collection key");if(t!=t||0===t)for(m=e.length;m--&&!g(e[m],t););else m=e.indexOf(t);return-1<m}function i(e){return s.call(this,this._keys,e)}function c(e,t){return this.has(e)?this._values[m]=t:this._values[this._keys.push(e)-1]=t,this}function u(){(this._keys||0).length=this._values.length=0}function a(){return l(this._itp,this._keys)}function h(){return l(this._itp,this._values)}function p(){return l(this._itp,this._keys,this._values)}function l(e,t,n){var r=[0],o=!1;return e.push(r),{next:function(){var s,i=r[0];return!o&&i<t.length?(s=n?[t[i],n[i]]:t[i],r[0]++):(o=!0,e.splice(e.indexOf(r),1)),{done:o,value:s}}}}function f(){return this._values.length}function d(e,t){for(var n=this.entries();;){var r=n.next();if(r.done)break;e.call(t,r.value[1],r.value[0],this)}}var m,v=Object.defineProperty,g=function(e,t){return e===t||e!==e&&t!==t};"undefined"!=typeof Map&&"function"==typeof(new Map).values&&(new Map).values().next||(e.Map=t({delete:r,has:i,get:o,set:c,keys:a,values:h,entries:p,forEach:d,clear:u}))}("undefined"!=typeof exports&&"undefined"!=typeof global?global:"undefined"!=typeof window?window:self);var pathRegexp=function(){function e(e,t){for(var n,r=[],o=0,c=0,u="",a=t&&t.delimiter||"/";null!=(n=m.exec(e));){var h=n[0],p=n[1],l=n.index;if(u+=e.slice(c,l),c=l+h.length,p)u+=p[1];else{var f=e[c],d=n[2],v=n[3],g=n[4],y=n[5],w=n[6],R=n[7];u&&(r.push(u),u="");var b=null!=d&&null!=f&&f!==d,O="+"===w||"*"===w,E="?"===w||"*"===w,k=n[2]||a,x=g||y;r.push({name:v||o++,prefix:d||"",delimiter:k,optional:E,repeat:O,partial:b,asterisk:!!R,pattern:x?i(x):R?".*":"[^"+s(k)+"]+?"})}}return c<e.length&&(u+=e.substr(c)),u&&r.push(u),r}function t(t,n){return o(e(t,n))}function n(e){return encodeURI(e).replace(/[\/?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function r(e){return encodeURI(e).replace(/[?#]/g,function(e){return"%"+e.charCodeAt(0).toString(16).toUpperCase()})}function o(e){for(var t=new Array(e.length),o=0;o<e.length;o++)"object"==typeof e[o]&&(t[o]=new RegExp("^(?:"+e[o].pattern+")$"));return function(o,s){for(var i="",c=o||{},u=s||{},a=u.pretty?n:encodeURIComponent,h=0;h<e.length;h++){var p=e[h];if("string"!=typeof p){var l,f=c[p.name];if(null==f){if(p.optional){p.partial&&(i+=p.prefix);continue}throw new TypeError('Expected "'+p.name+'" to be defined')}if(d(f)){if(!p.repeat)throw new TypeError('Expected "'+p.name+'" to not repeat, but received ~'+JSON.stringify(f)+"~");if(0===f.length){if(p.optional)continue;throw new TypeError('Expected "'+p.name+'" to not be empty')}for(var m=0;m<f.length;m++){if(l=a(f[m]),!t[h].test(l))throw new TypeError('Expected all "'+p.name+'" to match "'+p.pattern+'", but received ~'+JSON.stringify(l)+"~");i+=(0===m?p.prefix:p.delimiter)+l}}else{if(l=p.asterisk?r(f):a(f),!t[h].test(l))throw new TypeError('Expected "'+p.name+'" to match "'+p.pattern+'", but received "'+l+'"');i+=p.prefix+l}}else i+=p}return i}}function s(e){return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function i(e){return e.replace(/([=!:$\/()])/g,"\\$1")}function c(e,t){return e.keys=t,e}function u(e){return e.sensitive?"":"i"}function a(e,t){var n=e.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)t.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return c(e,t)}function h(e,t,n){for(var r=[],o=0;o<e.length;o++)r.push(f(e[o],t,n).source);var s=new RegExp("(?:"+r.join("|")+")",u(n));return c(s,t)}function p(t,n,r){return l(e(t,r),n,r)}function l(e,t,n){d(t)||(n=t||n,t=[]),n=n||{};for(var r=n.strict,o=n.end!==!1,i="",a=0;a<e.length;a++){var h=e[a];if("string"==typeof h)i+=s(h);else{var p=s(h.prefix),l="(?:"+h.pattern+")";t.push(h),h.repeat&&(l+="(?:"+p+l+")*"),l=h.optional?h.partial?p+"("+l+")?":"(?:"+p+"("+l+"))?":p+"("+l+")",i+=l}}var f=s(n.delimiter||"/"),m=i.slice(-f.length)===f;return r||(i=(m?i.slice(0,-f.length):i)+"(?:"+f+"(?=$))?"),i+=o?"$":r&&m?"":"(?="+f+"|$)",c(new RegExp("^"+i,u(n)),t)}function f(e,t,n){return d(t)||(n=t||n,t=[]),n=n||{},e instanceof RegExp?a(e,t):d(e)?h(e,t,n):p(e,t,n)}var d=Array.isArray||function(e){return"[object Array]"==Object.prototype.toString.call(e)},m=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g");return f.parse=e,f.compile=t,f.tokensToFunction=o,f.tokensToRegExp=l,f}();Route.prototype.getMethod=function(){return this.method},Route.prototype.getPath=function(){return this.path},Route.prototype.getHandler=function(){return this.handler},Route.prototype.getOpts=function(){return this.options},Route.prototype.getType=function(){return this.type},Route.prototype.match=function(e){return 3!=this.type&&((1==this.type||2==this.type)&&this.rule.test(e))},Route.prototype.getUrlParam=function(e){if(2==this.type){var t={},n=this.rule.exec(e),r=this.rule.keys;return r.forEach(function(e,r){t[e.name]=n[r+1]}),t}return null},Routes.prototype.add=function(e){if(!e instanceof Route)return!1;var t=e.getType();if(3==t)return!1;var n=e.getMethod().toLowerCase(),r=this.routes.get(n);r||(this.routes.set(n,[]),r=this.routes.get(n)),r.push(e)},Routes.prototype.match=function(e){return this.matchMethod(e.method,e.url)||this.matchMethod("any",e.url)},Routes.prototype.matchMethod=function(e,t){function n(e,t){if(!e)return null;for(var n=e.length-1;n>=0;--n){var r=e[n];if(r.match(t))return function(e){var n=r.getOpts(),o=r.getHandler(),s=r.getUrlParam(t);for(var i in options)"undefined"==typeof n[i]&&(n[i]=options[i]);return o(e,s,n)}}return null}e=(e+"").toLocaleLowerCase();var r=new URL(t),o=r.pathname;r.host!=self.location.host&&(o=t);var s=this.routes.get(e),i=n(s,o);return i?i:null};var routes=new Routes,defaultOptions={version:0,cache:{name:"tt-sw-cache-"+scope,method:["get"]},debug:!1,mainResUrl:"",networkTimeoutSeconds:5,preCacheItems:[],successResponses:/^0|200$/},tplOptions={version:29,cache:{name:"DOVE_AR"},preCacheItems:["https://res.imtt.qq.com/doveonly/threejs/model/logo-a_Mesh.lm","https://res.imtt.qq.com/doveonly/threejs/model/logo.lrani","https://res.imtt.qq.com/doveonly/threejs/model/logo.lh","https://res.imtt.qq.com/doveonly/threejs/model/VRayMtl1.lmat","https://res.imtt.qq.com/doveonly/threejs/model/logo_color2.jpg","https://res.imtt.qq.com/doveonly/threejs/build/lab.js","https://res.imtt.qq.com/doveonly/threejs/build/app.css"]},options=defaultOptions;tplOptions&&("number"==typeof tplOptions.version&&(options.version=tplOptions.version),tplOptions.cache&&(tplOptions.cache.name&&(options.cache.name="tt-sw-cache-"+encodeURIComponent(tplOptions.cache.name)+"-"+options.version),tplOptions.cache.method&&(options.cache.method=tplOptions.cache.method)),"string"==typeof tplOptions.mainResUrl&&(options.mainResUrl=tplOptions.mainResUrl),"boolean"==typeof tplOptions.debug&&(options.debug=tplOptions.debug),"number"==typeof tplOptions.networkTimeoutSeconds&&(options.networkTimeoutSeconds=tplOptions.networkTimeoutSeconds),tplOptions.preCacheItems&&0!=tplOptions.preCacheItems.length&&(options.preCacheItems=tplOptions.preCacheItems),tplOptions.successResponses instanceof RegExp&&(options.successResponses=tplOptions.successResponses));var route=new Route("GET","*",cacheFirst,{});routes.add(route);var route=new Route("GET",/(pinghot|badjs2)\.qq\.com.*$/i,networkOnly,{});routes.add(route),self.addEventListener("install",function(e){installListener(e,options)}),self.addEventListener("activate",function(e){activateListener(e,options)}),self.addEventListener("fetch",function(e){fetchListener(e,routes)});