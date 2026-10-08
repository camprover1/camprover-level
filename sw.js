const CACHE_NAME = "camprover-level-v4";

const ASSETS = [

  "./",

  "./index.html",

  "./manifest.json",

  "./sw.js",

  "./pitch_discovery.png",

  "./roll_discovery.png"

];


self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches
        .open(CACHE_NAME)

        .then(
          cache =>
            cache.addAll(ASSETS)
        )

        .then(
          () =>
            self.skipWaiting()
        )

    );

  }
);


self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches
        .keys()

        .then(
          keys =>

            Promise.all(

              keys

                .filter(
                  key =>
                    key !== CACHE_NAME
                )

                .map(
                  key =>
                    caches.delete(key)
                )

            )
        )

        .then(
          () =>
            self.clients.claim()
        )

    );

  }
);


self.addEventListener(
  "fetch",
  event => {

    event.respondWith(

      caches
        .match(event.request)

        .then(
          cached => {

            return (
              cached ||
              fetch(event.request)
            );

          }
        )

    );

  }
);
