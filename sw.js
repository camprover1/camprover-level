const CACHE_NAME = "camprover-level-no-cache-v5";


/*
====================================================
 CAMPROVER LEVEL SERVICE WORKER
====================================================

Eski sürümlerde index.html ve görseller cache'leniyordu.
Bu nedenle iPhone eski tasarımı göstermeye devam ediyordu.

Bu sürüm:
- index.html'i CACHE'lemez
- PNG görselleri CACHE'lemez
- CSS/JS içeren sayfayı CACHE'lemez
- Eski cache'leri otomatik siler
- Yeni sürüm geldiğinde hemen aktif olur
====================================================
*/


self.addEventListener("install", event => {

  event.waitUntil(

    self.skipWaiting()

  );

});


self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys()

      .then(keys => {

        return Promise.all(

          keys.map(key => {

            return caches.delete(key);

          })

        );

      })

      .then(() => {

        return self.clients.claim();

      })

  );

});


self.addEventListener("fetch", event => {

  const request = event.request;

  /*
  Sadece GET isteklerini ele al
  */

  if(request.method !== "GET"){
    return;
  }


  /*
  HTML ve görseller için:
  HER ZAMAN internetten güncel dosyayı al.
  */

  const url = new URL(request.url);


  const isAppFile =
    url.pathname.endsWith("/") ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".json");


  if(isAppFile){

    event.respondWith(

      fetch(
        new Request(request, {
          cache: "no-store"
        })
      )

      .then(response => {

        return response;

      })

      .catch(() => {

        /*
        İnternet yoksa son çare olarak cache'e bak.
        */

        return caches.match(request);

      })

    );

    return;

  }

});
