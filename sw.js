// 腦中風 PAC 衛教：離線快取。每次更新內容，請把 VERSION 改成新的字串。
const VERSION = "v20-1151018";
const CACHE = "pac-edu-" + VERSION;
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "img/ankle.webp", "img/banner.webp", "img/bathroom.webp", "img/bedside.webp", "img/bp.webp", "img/bridge.webp", "img/call119.webp", "img/cane.webp", "img/cards.webp", "img/caregiver.webp", "img/emblem.webp", "img/feeding.webp", "img/heelraise.webp", "img/home.webp", "img/ngtube.webp", "img/nightpath.webp", "img/posBack.webp", "img/posSit.webp", "img/posStrong.webp", "img/posWeak.webp", "img/sitstand.webp", "img/stairs.webp", "img/stick.webp", "img/team.webp", "img/towel.webp", "img/turning.webp", "img/walker.webp", "img/wheelchair.webp", "img/steps/sitstand-1.webp", "img/steps/sitstand-2.webp", "img/steps/sitstand-3.webp", "img/steps/sitstand-4.webp", "img/steps/sitstand-5.webp", "fonts/huninn-sub.woff2", "fonts/mitr-thai-400.woff2", "fonts/mitr-thai-600.woff2", "fonts/nunito-latin-400.woff2", "fonts/nunito-latin-800.woff2", "fonts/nunito-vietnamese-400.woff2", "fonts/nunito-vietnamese-800.woff2", "pics/i-bed.webp", "pics/i-bowl.webp", "pics/i-bp.webp", "pics/i-house.webp", "pics/i-pills.webp"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("pac-edu-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  // 影片交給瀏覽器自己處理（分段下載），沒網路時會顯示靜態圖
  if (new URL(req.url).pathname.indexOf("/vid/") > -1) return;
  if (req.mode === "navigate") {
    // 有網路時拿最新版，沒網路時用上次存下來的
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put("index.html", cp)); return r; }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
