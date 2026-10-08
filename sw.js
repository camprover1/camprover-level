const CACHE_NAME = "camprover-level-v5";


/*
====================================================
 CAMPROVER LEVEL - SERVICE WORKER
====================================================

 Bu sürüm eski cache'leri temizler.

 index.html
 PNG görseller
 CSS
 JS
 JSON

 dosyaları eski cache'den kullanılmaz.

 Her açılışta güncel dosya sunucudan alınır.
====================================================
*/


/* ==================================================
   SERVICE WORKER KURULUMU
================================================== */

self.addEventListener("install", event => {

  /*
   Yeni Service Worker'ı bekletmeden aktif et.
  */

  event.waitUntil(
    self.skipWaiting()
  );

});


/* ==================================================
   SERVICE WORKER AKTİFLEŞTİRME
================================================== */

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys()

      .then(keys => {

        /*
         Daha önce oluşturulmuş bütün cache'leri sil.

         Böylece:
         v1
         v2
         v3
         v4
         vb.

         eski dosyalar kalmaz.
        */

        return Promise.all(

          keys.map(key => {

            return caches.delete(key);

          })

        );

      })

      .then(() => {

        /*
         Açık olan sayfayı yeni Service Worker
         hemen kontrol etmeye başlasın.
        */

        return self.clients.claim();

      })

  );

});


/* ==================================================
   DOSYA İSTEKLERİ
================================================== */

self.addEventListener("fetch", event => {

  const request = event.request;


  /*
   Sadece GET isteklerini ele alıyoruz.
  */

  if(request.method !== "GET"){

    return;

  }


  const url =
    new URL(request.url);


  /*
   CAMPROVER LEVEL dosyaları
  */

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


  /*
   Uygulamanın dosyaları için:

   CACHE KULLANMA.

   Her zaman GitHub'daki güncel dosyayı
   almaya çalış.
  */

  if(isAppFile){

    event.respondWith(

      fetch(

        new Request(
          request,
          {
            cache:"no-store"
          }
        )

      )

      .then(response => {

        return response;

      })

      .catch(() => {

        /*
         İnternet yoksa son çare olarak
         mevcut cache'e bak.
        */

        return caches.match(request);

      })

    );

    return;

  }

});
