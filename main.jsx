import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ── Service Worker 등록 ──────────────────────────────────────
// 프로덕션 환경에서만 등록 (개발 환경 제외)
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log("[SW] 등록 성공:", registration.scope);

        // 새 버전 감지 시 사용자에게 알림
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // 새 버전 설치 완료 — 앱에 이벤트 전달
              window.dispatchEvent(new CustomEvent("sw-update-available"));
            }
          });
        });
      })
      .catch((err) => {
        console.warn("[SW] 등록 실패:", err);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
