# 🎱 AI 로또 — 실제 당첨 데이터 기반 번호 추천

## 프로젝트 구조

```
lotto-app/
├── api/
│   ├── recommend.js   # Claude API 프록시 (API 키 서버사이드 보호)
│   └── draw.js        # 동행복권 API 프록시 (CORS 해결)
├── src/
│   ├── main.jsx       # React 엔트리포인트
│   └── App.jsx        # 메인 앱
├── index.html
├── vite.config.js
├── vercel.json
├── package.json
└── .env.example
```

## Vercel 배포 방법

### 1. 저장소 준비
```bash
git init
git add .
git commit -m "init: AI 로또 앱"
# GitHub에 새 저장소 만들고 push
git remote add origin https://github.com/YOUR_NAME/ai-lotto.git
git push -u origin main
```

### 2. Vercel 연결
1. https://vercel.com 접속 → "Add New Project"
2. GitHub 저장소 연결
3. Framework Preset: **Vite** 선택
4. **Settings > Environment Variables** 에서 추가:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (실제 Anthropic API 키)
5. Deploy 클릭

### 3. 로컬 개발
```bash
npm install
cp .env.example .env.local
# .env.local 에 실제 API 키 입력

# Vercel CLI로 로컬 실행 (API 함수 포함)
npx vercel dev
```

> ⚠️ `npm run dev` 는 Vite 개발 서버만 실행되어 `/api` 함수가 동작하지 않습니다.
> API 함수 포함 로컬 테스트는 반드시 `npx vercel dev` 를 사용하세요.

## 보안 설계

| 항목 | 방식 |
|------|------|
| Anthropic API 키 | 서버사이드 환경변수 — 클라이언트에 절대 노출 안 됨 |
| 동행복권 CORS | `/api/draw` 서버에서 직접 호출 — 외부 프록시 불필요 |
| 입력값 검증 | prompt 길이, round 범위, 번호 유효성 서버에서 검증 |
| 캐시 | 과거 당첨 데이터는 `Cache-Control: max-age=86400` |

## 기능

- 🤖 실제 당첨 데이터 100회차 기반 AI 번호 추천
- 📊 핫/콜드/오버듀 번호 통계 분석
- 📁 번호 저장 및 히스토리 (localStorage)
- 🏆 회차별 당첨번호 조회 + 내 번호 비교
- 📱 PWA — 모바일 홈 화면에 앱으로 설치 가능
- 🔌 오프라인 지원 — Service Worker 캐싱

## PWA 설치 방법 (사용자)

**Android Chrome:**
1. 앱 접속 후 하단 "홈 화면에 추가" 배너 탭
2. 또는 브라우저 메뉴 → "앱 설치"

**iOS Safari:**
1. 하단 공유 버튼(□↑) 탭
2. "홈 화면에 추가" 선택

**데스크톱 Chrome:**
1. 주소창 우측 설치 아이콘(⊕) 클릭

