// public/sw.js
// Service Worker — AI 로또 PWA
// 전략: Cache First (정적 자산) + Network First (API)

const CACHE_NAME = "ai-lotto-v1";
const STATIC_CACHE_NAME = "ai-lotto-static-v1";
const API_CACHE_NAME = "ai-lotto-api-v1";

// 앱 셸: 오프라인에서도 기본 UI 표시
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192.svg",
  "/icon-512.svg",
];

// ── 설치: 앱 셸 사전 캐시 ──────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn("[SW] 일부 정적 자산 캐시 실패:", err);
      });
    })
  );
  // 새 SW가 즉시 활성화되도록
  self.skipWaiting();
});

// ── 활성화: 이전 캐시 정리 ────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(
            (key) =>
              key !== STATIC_CACHE_NAME &&
              key !== API_CACHE_NAME &&
              key !== CACHE_NAME
          )
          .map((key) => {
            console.log("[SW] 오래된 캐시 삭제:", key);
            return caches.delete(key);
          })
      );
    })
  );
  // 모든 클라이언트가 새 SW를 즉시 사용
  self.clients.claim();
});

// ── fetch 인터셉트 ────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1) /api/* — Network First (항상 최신 데이터)
  //    실패 시 캐시 응답 (당첨 조회용)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // 2) 외부 API (동행복권, Anthropic) — 네트워크만, SW 개입 없음
  if (
    url.hostname.includes("dhlottery") ||
    url.hostname.includes("anthropic") ||
    url.hostname.includes("allorigins")
  ) {
    return; // 브라우저 기본 처리
  }

  // 3) 폰트 (Google Fonts) — Cache First
  if (url.hostname.includes("fonts.googleapis.com") || url.hostname.includes("fonts.gstatic.com")) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
    return;
  }

  // 4) 정적 자산 (JS, CSS, SVG, HTML) — Cache First
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "document" ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".json")
  ) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
    return;
  }

  // 5) 기타 — Network First
  event.respondWith(networkFirstStrategy(request));
});

// ── Cache First 전략 ──────────────────────────────────────
async function cacheFirstStrategy(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // 오프라인 + 캐시 없음: 앱 셸로 폴백
    const fallback = await caches.match("/index.html");
    return fallback || new Response("오프라인 상태입니다.", { status: 503 });
  }
}

// ── Network First 전략 ────────────────────────────────────
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    if (response.ok && request.method === "GET") {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // 네트워크 실패 → 캐시 폴백
    const cached = await caches.match(request);
    if (cached) return cached;

    // API 요청 실패 시 JSON 에러 반환
    if (request.url.includes("/api/")) {
      return new Response(
        JSON.stringify({ error: "오프라인 상태입니다. 인터넷 연결을 확인해주세요." }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response("오프라인 상태입니다.", { status: 503 });
  }
}
