var config = {
  db : 'resource'
};

var addToCache = function(req) {
  return fetch(req.clone()).then(function(resp) {
    var cacheResp = resp.clone();

    console.log('addToCache 1' + req.url);

    if (resp.status !== 200 || (resp.type !== 'basic' && resp.type !== 'cors')) {
      console.log('addToCache 2' + req.url);
        return resp;
    }

    console.log('addToCache 3' + req.url);

    caches.open(config.db).then(function(cache) {
      console.log('addToCache 4' + req.url);
      cache.put(req.clone(), cacheResp);
    });

    console.log('addToCache 5' + req.url);

    return resp;
  });
};

self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(cacheNames) {
    return Promise.all(cacheNames.map(function(cacheName) {
      if (cacheName !== config.db) {
        return caches.delete(cacheName);
      }
    }));
  }));
});

self.addEventListener('fetch', function(event) {
  var promise, req, url = event.request.url;

  if (url.indexOf('bypass=1') !== -1 || url.indexOf('http:') === 0) {
    event.respondWith(fetch(event.request.clone()));
    return;
  }

  if (url.indexOf('cors=1') !== -1) {
    req = new Request(url, {mode : 'cors'});
  } else {
    req = event.request.clone();
  }

  promise = caches.open(config.db).then(function(cache) {
    return cache.match(req);
  }).then(function(response) {
    if (response) {
      addToCache(req );
      return response;
    } else {
      return addToCache(req );
    }
  });

  event.respondWith(promise);
});