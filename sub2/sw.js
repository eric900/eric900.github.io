var defaultOptions = {
    version : 0,
    cache : {
        name : 'tt-sw-cache-',
        method : ['get']
    },
    debug : false,
    mainResUrl : '',
    networkTimeoutSeconds : 5,
    preCacheItems : [new Request('https://res.imtt.qq.com/doveonly/threejs/build/app.css'),new Request('https://res.imtt.qq.com/doveonly/threejs/build/lab.js')],
    successResponses : /^0|200$/
};
var options = defaultOptions;

function installListener(event, options) {
    caches.has('v1').then(function(hasCache) {
        if (!hasCache) {
            caches.open('v1');
        }
    }).catch(function() {

    });
    caches.has('v1').then(function(hasCache) {
        if (!hasCache) {
            caches.open('v1');
        }
    }).catch(function() {

    });
    caches.open('v2').then(function(cache){
        var r11 = new Request('http://info.3g.qq.com?v=11');
        var p11 = new Response('', {headers:{'v':'11'}});
        cache.put(r11, p11);
        caches.match(r11).then(function(response) {
            var rtmp = new Request('http://info.3g.qq.com?v=tmp');
            cache.put(rtmp, response);
        });
    });
    caches.keys().then(function(keyList) {
      keyList.forEach(function(key, index, array) {
        caches.delete(key);
      });
    });
    caches.has('v1').then(function(hasCache) {
        if (hasCache) {
            caches.open('v1');
        }
    }).catch(function() {

    });
    caches.match(new Request('http://info.3g.qq.com?v=11')).then(function(response) {
        
    });
    caches.open(options.cache.name).then(function(cache){
    	var r1 = new Request('http://info.3g.qq.com?v=1');
    	var r2 = new Request('http://info.3g.qq.com?v=2');
    	var p1 = new Response('', {headers:{'v':'1'}});
    	var p2 = new Response('', {headers:{'v':'2'}});
    	cache.put(r1, p1);
    	cache.put(r2, p2);
    	cache.match(r2).then(function(r){
    		var rr = new Request('http://info.3g.qq.com?v=rr');
      		cache.put(rr, r);
    	});
    	cache.matchAll(r1, {ignoreSearch:true}).then(function(rs){
    		rs.forEach(function(r, index, array) {
                var rr = new Request('http://3g.qq.com?v='+index);
      			cache.put(rr, r);
    		});
    	});
        cache.keys(new Request('http://3g.qq.com?v=0')).then(function(keys) {
            keys.forEach(function(request, index, array) {
                cache.delete(request);
            });
        });
        cache.match(new Request('http://3g.qq.com?v=0')).then(function(r){
            var rr = new Request('http://info.3g.qq.com?v=rr');
            cache.put(rr, r);
        });
        cache.keys(new Request('http://3g.qq.com'), {ignoreSearch:true}).then(function(keys) {
            keys.forEach(function(request, index, array) {
                cache.delete(request);
            });
        });
        cache.match(new Request('http://3g.qq.com'), {ignoreSearch:true}).then(function(r){
            var rr = new Request('http://info.3g.qq.com?v=rr');
            cache.put(rr, r);
        });
        cache.keys(new Request('http://3g.qq.com'), {ignoreSearch:true}).then(function(keys) {
            keys.forEach(function(request, index, array) {
                cache.delete(request);
            });
        });
        cache.keys().then(function(keys) {
            keys.forEach(function(request, index, array) {
                cache.delete(request);
            });
        });
        cache.keys().then(function(keys) {
            keys.forEach(function(request, index, array) {
                cache.delete(request);
            });
        });
        cache.match(r2).then(function(r){
            var rr = new Request('http://info.3g.qq.com?v=rr');
            cache.put(rr, r);
        });
        cache.matchAll(r1, {ignoreSearch:true}).then(function(rs){
            rs.forEach(function(r, index, array) {
                var rr = new Request('http://3g.qq.com?v='+index);
                cache.put(rr, r);
            });
        });
        cache.add(new Request('http://info.3g.qq.com/g/s?aid=index&from=wap3g&s_it=1&sid=00'));
    	cache.addAll(options.preCacheItems).then(function() {

		});
    });
}

function activateListener(event, options) {
	caches.open(options.cache.name).then(function(cache){
    	var request1 = new Request('https://res.imtt.qq.com/doveonly/threejs/build/app.css');
		cache.match(request1);
		var request2 = new Request('https://res.imtt.qq.com/doveonly/threejs/build/lab.js');
		cache.match(request2);
        var request3 = new Request('http://info.3g.qq.com/g/s?aid=index&from=wap3g&s_it=1&sid=00');
        cache.match(request3);
	});
}

self.addEventListener('install', function(event) {
    installListener(event, options);
});

self.addEventListener('activate', function(event) {
    activateListener(event, options);
});