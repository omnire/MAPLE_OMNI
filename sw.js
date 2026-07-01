/**
 * ============================================================================
 * 🌐 MAPLE OMNI V14 - sw.js [서비스 워커 백그라운드 캐싱 엔진]
 * 설명: PWA 앱이 독립적인 하나의 독립 PC 프로그램처럼 메모리에 상주하도록 제어합니다.
 * ============================================================================
 */

// [초보자용 주석] 캐시 장부의 식별 이름입니다. 새로운 패치가 있을 때 버전 숫자를 변경합니다.
const CACHE_NAME = 'omni-cache-v14';

// [초보자용 주석] 로컬 하드디스크에 영구 적재할 V14 핵심 인프라 파일 리스트입니다.
const urlsToCache = [
  './index.html',
  './css/style.css',
  './features/hunt/record.css',
  './features/hunt/record.js'
];

// 서비스 워커가 최초 설치될 때 실행되는 가동 장치
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('V14 PWA 캐싱 엔진 가동 시작');
      // 파일별로 하나씩 시도하여 하나가 실패해도 전체가 멈추지 않게 함
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
        } catch (e) {
          console.warn(`[캐싱 경고] 파일을 찾을 수 없어 건너뜁니다: ${url}`);
        }
      }
    })
  );
});

// 사냥 제어 도중 패치 요청을 가로채 오프라인에서도 즉시 반응하도록 연결하는 브릿지
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});