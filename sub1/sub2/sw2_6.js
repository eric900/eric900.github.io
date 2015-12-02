var EXTRA_FILES = [
  "/xjs/_/js/k=xjs.ntp.en_US.x2OHbs3a9uo.O/m=jsa,ntp,d,csi/rt=j/d=1/t=zcms/rs=ACT90oGojrO4JscRQ5WXaL9a2Eh9gEDjrw",
];
var CHECKSUM = "p15r61";

var BLACKLIST = [
  '/gen_204\?',
  '/async/',
];

var FILES = [
  '/images/srpr/logo11w.png',
  '/images/srpr/chrome_ntp_white_logo2.png',
      '/' + '/ssl.gstatic.com/chrome/components/doodle-notifier-01.html'
].concat(EXTRA_FILES || []);

var CACHENAME = 'newtab-static-' + CHECKSUM;

self.addEventListener('install', function(event) {
  console.log('install haha!');
  event.waitUntil(caches.open(CACHENAME).then(function(cache) {
    return cache.addAll(FILES);
  }));
});


self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request);
      }
    )
  );
});