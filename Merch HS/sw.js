// Generar App Shell

let static_cache = ' static_cache-v1';
let dynamic_cache = ' dynamic_cache-v1';
let inmutable_cache = ' inmutable_cache-v1';


let files_appShell = [
    "/",
    "index.html",
    "main.js",
    "not-found.html",
    "estilo.css",
    "manisfest.json",
    "./imagenes/products/7.png",
    "./imagenes/products/13.png",
    "./imagenes/products/14.png",
    "./imagenes/products/18.png",
    "./imagenes/products/31.png",
    "./imagenes/products/Bolsa.png", 
    "./imagenes/products/Harry2.jpg",
    "./imagenes/products/Botella.png",   

];

let inmutableFiles = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
]

//funcion anonima: ()=>
//waitUntil = espera hasta

self.addEventListener('install' , result=> {
    console.log("SW instalado")
    //abre el cache con base al nombre y sino existe lo crea
    //catch de un promise va a atrapar el error o que es lo que no cumple
   

    const openStatic = caches.open(static_cache).then(cache =>{
        cache.addAll(files_appShell);
    });

    const openInmutable = caches.open(inmutable_cache).then(cache =>{
        cache.addAll(inmutableFiles);
    });

    result.waitUntil(
        Promise.all([
            openStatic,
            openInmutable
        ])
        
         
    );
    
})
// Elimina cualquier caché que no esté en: expectedCaches
// Se deshaga de static-v1
self.addEventListener('activate', event => {
    console.log("SW activado")
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (!static_cache.includes(key) && key.includes('static')) {
                    return caches.delete(key);
                }
            })
        )).then(() => {
            console.log('V2 lista para manejar las recuperaciones!');
        })
    );
});

self.addEventListener('fetch', event => {


event.respondWith(caches.match(event.request).then(
        cacheResponse => {
            //Si estuvo en cache, lo va a regresar
            if(cacheResponse) return cacheResponse;
            //Sino estuvo en cache , lo va a buscar en la red
            return fetch(event.request).then(
                networkResponse =>{
                    caches.open(dynamic_cache).then (cache => {
                        cache.put(event.request, networkResponse)
                        //Funcion de limpiar cache
                        //caches.delete(cacheName).then(function(cache) {
                            // your cache is now deleted
                          //}
                          //);
                    })
                }
            )//.catch(err =>{
                //Aqui se maneja el error
              //  console.log('no se encontro');
            //})
        }
    ))

})
self.addEventListener('message', msj => {
    //Revisar si el msj tiene el mensaje 'skipwaiting'
    if (msj.data.action == 'skipWaiting') {
        //Ejecutar el skipWaiting
        self.skipWaiting();

    }
})

// 1.- Cache Only: no se va a conectar a Internet
// Fetch:hace un apeticion a internet o a propios archivos
//match:sinonimo de igualdad
//Codigo:
    //event.respondWith(
      //  caches.match(event.request)
    //)

    // 2.1Network only:La app solo mandara peticiones a internet
    //Codigo:
    // event.respondWith(
    // fetch(event.request)

   // 3. Cache First
    /* La pagina web, primero antes que nada, va a revisar si los recurso
    estan dentro del cache, en caso contrario, los va a pedir en Internet*/
    // IF,   promise  (then, catch)

    /* if (caches.match(event.request)) {
        event.respondWith(caches.match(event.request))
    } else {
        event.respondWith(fetch(event.request))
    } */
    //event.respondWith(caches.match(event.request).then(
      //  cacheResponse => {
        //    return cacheResponse || fetch(event.request)
      //  }
    //))

    /*4.-NETWORK FIRST:obtener los datos mas actualizados desde la red, cuando 
    no se puede almacenar cierta info en cache*/
    //V1
    /*event.respondWith(fetch(event.request).then(
       networkResponse => {
        return networkResponse || caches.match(event.request).catch(error =>{
            //error de que no se encuentra en el cache
        })
        }
    ).catch(erro =>{
        //error de que se encuentre en la red
    }))*/

    //V2
    //si no devuleve el fetch devuelve el cache
    //event.responWith(fetch(event-request).catch(error => caches.match(event.request)))
    
    /* 5.- Primero el cache , sino esta busca en la red y 
    si encuentra lo guarda en cache
    */
    /* Primera forma:
    event.respondWith(caches.match(event.request).then(
        cacheResponse => {
            return cacheResponse || fetch(event.request).then(
                networkRespone =>{
                    //Limpiar Cache
                    caches.open(cacheName).then(function(cache) {
                        cache.put(event.request, response);
                      })
                      return response.clone();
                    

                }
            )
        }
    ))*/

    

//Promesas se pueden cumplir o no se cumplen
//refactorizar: corregir ver aun en que esta mal