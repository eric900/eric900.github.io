function buildImage(){
        var imgs = document.querySelectorAll(['figure', '.banner a'])
   for(var i = 0; i< imgs.length; i++){
      var uri =  imgs[i].getAttribute('uri');
      console.log(uri);
      if(uri){
         imgs[i].style.background = 'url('+uri.replace(/http:\/\//, 'https:\/\/')+'?cors=1)';
         imgs[i].style.backgroundPosition = 'center'  
         imgs[i].style.backgroundSize = 'cover';
      }
   }
   document.body.style.display = "block";
}

 //业务层开始

function init() {
        buildImage();
 //        if ('serviceWorker' in navigator) {
 //               navigator.serviceWorker.register('./sw.js').then(function(registration) {
	//              // Registration was successful
	//              console.log('ServiceWorker registration successful with scope: ',    registration.scope);
	//        }).catch(function(err) {
	//             // registration failed :(
	// 	    console.log('ServiceWorker registration failed: ', err);
	//        });
	// }

}