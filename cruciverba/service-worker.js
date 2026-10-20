const PREFIX='cruciverba-windows:'+self.registration.scope+':';
const CACHE=PREFIX+'d73a4f7c822fc69c';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
const URLS=new Set(ASSETS.map(asset=>new URL(asset,self.registration.scope).href));
// Un aggiornamento entra in funzione alla chiusura di tutte le finestre del gioco.
// Non modificare localStorage: contiene partita, accettazione e preferenze.
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).catch(async error=>{await caches.delete(CACHE);throw error;})));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);url.hash='';url.search='';
 if(event.request.method!=='GET'||!URLS.has(url.href))return;
 event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(url.href))||fetch(event.request)));
});
