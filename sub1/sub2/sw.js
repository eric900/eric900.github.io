self.addEventListener('install', function(event) {
  console.log('install haha3!');
});

self.addEventListener('activate', function(event) {
    console.log('activate haha3!');
});

self.addEventListener('fetch', function(event) {
  // console.log(event.request.url);
  // event.respondWith(
  //   caches.match(event.request)
  //     .then(function(response) {
  //       // Cache hit - return response
  //       if (response) {
  //         return response;
  //       }

  //       return fetch(event.request);
  //     }
  //   )
  // );
});