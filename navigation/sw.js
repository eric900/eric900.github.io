var config = {
  db : 'resource'
};

var addToCache = function(req) {
  return fetch(req.clone()).then(function(resp) {
    var cacheResp = resp.clone();

    if (resp.status !== 200 || (resp.type !== 'basic' && resp.type !== 'cors')) {
        return resp;
    }

    caches.open(config.db).then(function(cache) {
      cache.put(req.clone(), cacheResp);
    });

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
  var promise;

  if (event.request.url.indexOf('bypass=1') !== -1) {
    event.respondWith(fetch(event.request.clone()));
    return;
  }

  promise = caches.open(config.db).then(function (cache) {
    return cache.match(event.request.clone());
  }).then(function (response) {
    if (response) {
      addToCache(event.request);
      return response;
    } else {
      return addToCache(event.request);
    }
  });

  event.respondWith(promise);
});