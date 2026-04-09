import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // public/sw.js를 직접 사용 (injectManifest 모드)
      strategies: "injectManifest",
      srcDir: "public",
      filename: "sw.js",

      // manifest는 public/manifest.json 을 직접 사용
      manifest: false,

      injectManifest: {
        // 빌드 산출물 중 사전 캐시할 파일 패턴
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
        // 최대 캐시 파일 크기 (4 MB)
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },

      devOptions: {
        // 개발 환경에서도 SW 활성화 (테스트용)
        enabled: false,
        type: "module",
      },
    }),
  ],
});
