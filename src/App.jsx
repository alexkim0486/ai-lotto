import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// 다국어 텍스트 (한국어 / English)
// ─────────────────────────────────────────────
const I18N = {
  ko: {
    appSubtitle:       "실제 당첨 데이터 100회차 기반 AI 분석",
    dataReady:         (n) => `최근 ${n}회차 데이터 완료`,
    dataNone:          "데이터 미수집",
    dataLoading:       (p) => `데이터 수집 중... ${p}%`,
    dataCollectBtn:    "📡 당첨 데이터 100회차 수집하기",
    dataRefresh:       "🔄 데이터 새로고침",
    dataApiLabel:      "동행복권 API 수집 중",

    tabRecommend:      "🎱 추천",
    tabStats:          "📊 통계",
    tabHistory:        "📁 히스토리",
    tabWin:            "🏆 당첨조회",

    gameCountLabel:    "게임 수 선택",
    recommendBtn:      "✨ AI 번호 추천받기",
    recommendLoading:  "AI 분석 중...",
    dataWaiting:       "⏳ 데이터 로딩 중...",
    recommendedLabel:  "추천 번호",
    gameLabel:         (n) => `게임 ${n}`,
    saveBtn:           "📁 번호 저장하기",
    savedBtn:          "✅ 저장 완료!",
    disclaimer:        "⚠️ AI 추천은 통계 분석 기반의 참고용이며, 실제 당첨을 보장하지 않습니다. 로또는 완전한 무작위 추첨입니다.",
    skeletonLabel:     (n) => `게임 ${n} 분석 중...`,
    errorPrefix:       "⚠️ ",

    statsNoData:       "당첨 데이터가 필요해요",
    statsCollectBtn:   (p, loading) => loading ? `수집 중 ${p}%` : "📡 데이터 수집하기",
    statsSummaryRounds:"분석 회차",
    statsSummaryAvg:   "평균 합계",
    statsSummaryOddEven:"홀짝 비율",
    statsHot:          "🔥 핫 번호 TOP 10 (자주 출현)",
    statsOverdue:      "⏰ 오버듀 번호 TOP 10 (오래 미출현)",
    statsZone:         "📊 구간별 출현 분포",
    statsFreq:         "🔢 전체 번호 출현 빈도",
    statsRoundsUnit:   (n) => `${n}회`,
    statsCountUnit:    (n) => `${n}회`,

    historyEmpty:      "저장된 번호가 없어요",
    historyEmptySub:   "AI 추천을 받고 저장해보세요!",
    historyTotal:      (n) => `총 ${n}건 저장됨`,
    historyClearAll:   "전체 삭제",
    historyGameLabel:  (n, s) => `게임 ${n}${s ? ` · ${s}` : ""}`,

    winInputLabel:     "회차 번호 입력",
    winPlaceholder:    "예: 1170",
    winQueryBtn:       "조회",
    winQuerying:       "조회 중",
    winAutoFill:       "→ 최신 회차 자동입력",
    winRound:          (n) => `제 ${n}회`,
    winPrize1:         "1등 당첨금",
    winPrize1Unit:     (v) => `${v?.toLocaleString()}원`,
    winPrize1Cnt:      (n) => `${n}명`,
    winBonus:          (n) => `보너스: ${n}`,
    winCompareTitle:   "📋 내 번호 비교",
    winMatchCount:     (n) => `${n}개 일치`,
    winBonusMatch:     " +🎯",
    winRanks:          ["🥇 1등", "🥈 2등", "🥉 3등", "4등", "5등"],

    installTitle:      "홈 화면에 추가하기",
    installSub:        "앱처럼 바로 실행할 수 있어요",
    installBtn:        "설치",
    installClose:      "닫기",
    updateMsg:         "🔄 새 버전이 출시됐어요!",
    updateBtn:         "업데이트",
    updateLater:       "나중에",

    aiReason:          "🤖 ",
  },
  en: {
    appSubtitle:       "AI analysis based on 100 real draw rounds",
    dataReady:         (n) => `Last ${n} rounds loaded`,
    dataNone:          "No data yet",
    dataLoading:       (p) => `Fetching data... ${p}%`,
    dataCollectBtn:    "📡 Fetch 100 rounds of draw data",
    dataRefresh:       "🔄 Refresh data",
    dataApiLabel:      "Fetching from lottery API",

    tabRecommend:      "🎱 Pick",
    tabStats:          "📊 Stats",
    tabHistory:        "📁 History",
    tabWin:            "🏆 Results",

    gameCountLabel:    "Number of games",
    recommendBtn:      "✨ Get AI Numbers",
    recommendLoading:  "Analyzing...",
    dataWaiting:       "⏳ Loading data...",
    recommendedLabel:  "Recommended",
    gameLabel:         (n) => `Game ${n}`,
    saveBtn:           "📁 Save numbers",
    savedBtn:          "✅ Saved!",
    disclaimer:        "⚠️ AI picks are for reference only based on statistical analysis. Lottery draws are completely random.",
    skeletonLabel:     (n) => `Analyzing game ${n}...`,
    errorPrefix:       "⚠️ ",

    statsNoData:       "Draw data needed",
    statsCollectBtn:   (p, loading) => loading ? `Fetching ${p}%` : "📡 Fetch draw data",
    statsSummaryRounds:"Rounds",
    statsSummaryAvg:   "Avg. sum",
    statsSummaryOddEven:"Odd/Even",
    statsHot:          "🔥 Hot Numbers TOP 10",
    statsOverdue:      "⏰ Overdue Numbers TOP 10",
    statsZone:         "📊 Number range distribution",
    statsFreq:         "🔢 Full frequency chart",
    statsRoundsUnit:   (n) => `${n}`,
    statsCountUnit:    (n) => `${n}`,

    historyEmpty:      "No saved numbers yet",
    historyEmptySub:   "Get an AI pick and save it!",
    historyTotal:      (n) => `${n} saved`,
    historyClearAll:   "Clear all",
    historyGameLabel:  (n, s) => `Game ${n}${s ? ` · ${s}` : ""}`,

    winInputLabel:     "Enter draw round",
    winPlaceholder:    "e.g. 1170",
    winQueryBtn:       "Search",
    winQuerying:       "Searching",
    winAutoFill:       "→ Auto-fill latest round",
    winRound:          (n) => `Round ${n}`,
    winPrize1:         "1st prize",
    winPrize1Unit:     (v) => `₩${v?.toLocaleString()}`,
    winPrize1Cnt:      (n) => `${n} winner(s)`,
    winBonus:          (n) => `Bonus: ${n}`,
    winCompareTitle:   "📋 Compare my numbers",
    winMatchCount:     (n) => `${n} match`,
    winBonusMatch:     " +🎯",
    winRanks:          ["🥇 1st","🥈 2nd","🥉 3rd","4th","5th"],

    installTitle:      "Add to Home Screen",
    installSub:        "Launch it like an app",
    installBtn:        "Install",
    installClose:      "Close",
    updateMsg:         "🔄 A new version is available!",
    updateBtn:         "Update",
    updateLater:       "Later",

    aiReason:          "🤖 ",
  },
};

// ─────────────────────────────────────────────
// 색상 팔레트
// ─────────────────────────────────────────────
const BALL_COLORS = {
  "1-10":  { bg: "#f5c518", text: "#1a1a1a" },
  "11-20": { bg: "#4fc3f7", text: "#1a1a1a" },
  "21-30": { bg: "#ef5350", text: "#ffffff" },
  "31-40": { bg: "#9c9c9c", text: "#ffffff" },
  "41-45": { bg: "#66bb6a", text: "#ffffff" },
};
function getBallColor(n) {
  if (n <= 10) return BALL_COLORS["1-10"];
  if (n <= 20) return BALL_COLORS["11-20"];
  if (n <= 30) return BALL_COLORS["21-30"];
  if (n <= 40) return BALL_COLORS["31-40"];
  return BALL_COLORS["41-45"];
}

// ─────────────────────────────────────────────
// LottoBall 컴포넌트
// ─────────────────────────────────────────────
function LottoBall({ number, size = 52, animated = false, delay = 0, dimmed = false }) {
  const { bg, text } = getBallColor(number);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: dimmed
          ? "#2a2a3e"
          : `radial-gradient(circle at 35% 35%, ${bg}ee, ${bg}99)`,
        color: dimmed ? "#555" : text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Black Han Sans', sans-serif",
        fontSize: size * 0.34,
        fontWeight: 900,
        flexShrink: 0,
        boxShadow: dimmed
          ? "none"
          : `0 4px 14px ${bg}55, inset 0 -3px 8px rgba(0,0,0,0.18), inset 0 3px 8px rgba(255,255,255,0.3)`,
        border: `2px solid ${dimmed ? "#333" : bg + "cc"}`,
        animation: animated
          ? `popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) ${delay}s both`
          : "none",
        transition: "all 0.3s",
        userSelect: "none",
      }}
    >
      {number}
    </div>
  );
}

// ─────────────────────────────────────────────
// SectionCard 컴포넌트
// ─────────────────────────────────────────────
function SectionCard({ title, color, children }) {
  return (
    <div
      style={{
        background: "#14142a",
        borderRadius: 16,
        padding: "16px",
        border: "1px solid #22223a",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color,
          fontWeight: 700,
          marginBottom: 14,
          letterSpacing: 0.5,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// localStorage 헬퍼
// ─────────────────────────────────────────────
const LS = {
  get: (k, def) => {
    try {
      const v = localStorage.getItem(k);
      return v !== null ? JSON.parse(v) : def;
    } catch {
      return def;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};

// ─────────────────────────────────────────────
// 최신 회차 추정 (2002-12-07 = 1회차)
// ─────────────────────────────────────────────
function estimateLatestRound() {
  const base = new Date("2002-12-07T00:00:00+09:00");
  const now = new Date();
  return Math.max(1, Math.floor((now - base) / (7 * 24 * 60 * 60 * 1000)) + 1);
}

// ─────────────────────────────────────────────
// 당첨 데이터 fetch — /api/draw (서버사이드 CORS 해결)
// ─────────────────────────────────────────────
async function fetchDrawData(round) {
  const res = await fetch(`/api/draw?round=${round}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.error) return null;
  return data;
}

// ─────────────────────────────────────────────
// 통계 분석
// ─────────────────────────────────────────────
function analyzeDraws(draws) {
  const freq = {};
  const lastSeen = {};

  const sorted = [...draws].sort((a, b) => b.round - a.round);

  sorted.forEach((draw, idx) => {
    draw.numbers.forEach((n) => {
      freq[n] = (freq[n] || 0) + 1;
      if (lastSeen[n] === undefined) lastSeen[n] = idx;
    });
  });

  const freqArr = Array.from({ length: 45 }, (_, i) => {
    const n = i + 1;
    return {
      num: n,
      count: freq[n] || 0,
      gap: lastSeen[n] !== undefined ? lastSeen[n] : sorted.length,
    };
  });

  const hot     = [...freqArr].sort((a, b) => b.count - a.count).slice(0, 10);
  const cold    = [...freqArr].sort((a, b) => a.count - b.count).slice(0, 10);
  const overdue = [...freqArr].sort((a, b) => b.gap - a.gap).slice(0, 10);

  const zones = { "1~9": 0, "10~19": 0, "20~29": 0, "30~39": 0, "40~45": 0 };
  freqArr.forEach(({ num, count }) => {
    if (num <= 9)       zones["1~9"]   += count;
    else if (num <= 19) zones["10~19"] += count;
    else if (num <= 29) zones["20~29"] += count;
    else if (num <= 39) zones["30~39"] += count;
    else                zones["40~45"] += count;
  });

  let odd = 0, even = 0;
  freqArr.forEach(({ num, count }) =>
    num % 2 !== 0 ? (odd += count) : (even += count)
  );

  const recentDraws = sorted.slice(0, 20);
  const sumList = recentDraws.map((d) => d.numbers.reduce((a, b) => a + b, 0));
  const avgSum =
    sumList.length > 0
      ? Math.round(sumList.reduce((a, b) => a + b, 0) / sumList.length)
      : 0;

  return {
    freq,
    freqArr,
    hot,
    cold,
    overdue,
    zones,
    odd,
    even,
    avgSum,
    totalDraws: draws.length,
  };
}

// ─────────────────────────────────────────────
// AI 추천 프롬프트 빌더
// ─────────────────────────────────────────────
function buildPrompt(stats, gameCount, userHistory, gameIndex, lang = "ko") {
  const { hot, cold, overdue, zones, odd, even, avgSum, totalDraws } = stats;
  const total = odd + even || 1;
  const isKo = lang === "ko";

  const historyText =
    userHistory.length > 0
      ? (isKo
          ? `[사용자 저장 번호 패턴 (최근 5건)]\n${userHistory.slice(0, 5).map((e) => `  ${(e.numbers || []).join(", ")}`).join("\n")}`
          : `[User saved number patterns (last 5)]\n${userHistory.slice(0, 5).map((e) => `  ${(e.numbers || []).join(", ")}`).join("\n")}`)
      : (isKo ? "[사용자 저장 번호 없음]" : "[No saved numbers]");

  return isKo
    ? `[최근 ${totalDraws}회차 실제 당첨번호 심층 분석]

🔥 핫 번호 (출현 빈도 상위): ${hot.map((h) => `${h.num}번(${h.count}회)`).join(", ")}
🧊 콜드 번호 (출현 빈도 하위): ${cold.map((c) => `${c.num}번(${c.count}회)`).join(", ")}
⏰ 오버듀 번호 (최근 미출현): ${overdue.map((o) => `${o.num}번(${o.gap}회 연속 미출현)`).join(", ")}

📊 구간별 누적 출현:
${Object.entries(zones).map(([k, v]) => `  ${k}구간: ${v}회`).join("\n")}

⚖️ 홀짝 비율: 홀수 ${Math.round((odd / total) * 100)}% / 짝수 ${Math.round((even / total) * 100)}%
➕ 최근 20회 번호 합계 평균: ${avgSum} (참고: 이상적 합계 범위 100~175)

${historyText}

위 통계를 바탕으로 ${gameCount}게임 중 ${gameIndex + 1}번째 게임 번호를 추천해주세요.
${gameIndex > 0 ? "※ 이전 게임들과 다른 전략 유형으로 추천해주세요." : ""}
추천 이유에 반드시 위 통계의 구체적 수치를 인용해주세요.`.trim()
    : `[Deep analysis of last ${totalDraws} real draw rounds]

🔥 Hot numbers (high frequency): ${hot.map((h) => `${h.num}(${h.count}x)`).join(", ")}
🧊 Cold numbers (low frequency): ${cold.map((c) => `${c.num}(${c.count}x)`).join(", ")}
⏰ Overdue numbers (not drawn recently): ${overdue.map((o) => `${o.num}(${o.gap} rounds absent)`).join(", ")}

📊 Zone distribution:
${Object.entries(zones).map(([k, v]) => `  ${k}: ${v} times`).join("\n")}

⚖️ Odd/Even ratio: Odd ${Math.round((odd / total) * 100)}% / Even ${Math.round((even / total) * 100)}%
➕ Average sum (last 20 draws): ${avgSum} (ideal range: 100–175)

${historyText}

Based on the above, recommend game ${gameIndex + 1} of ${gameCount}.
${gameIndex > 0 ? "※ Use a different strategy from previous games." : ""}
Please cite specific statistics in your reason.`.trim();
}

// ─────────────────────────────────────────────
// AI 추천 fetch — /api/recommend (서버사이드 API 키)
// ─────────────────────────────────────────────
async function fetchAIRecommendation(prompt) {
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error || "AI recommendation error");
  }

  return data; // { numbers, reason, strategy }
}

// ─────────────────────────────────────────────
// 메인 App
// ─────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("recommend");
  const [lang, setLang] = useState(() => LS.get("lotto_lang", "ko"));
  const t = I18N[lang];
  const toggleLang = () => {
    const next = lang === "ko" ? "en" : "ko";
    setLang(next);
    LS.set("lotto_lang", next);
  };

  // 당첨 데이터
  const [draws, setDraws]               = useState(() => LS.get("lotto_draws", []));
  const [drawsLoading, setDrawsLoading] = useState(false);
  const [drawsProgress, setDrawsProgress] = useState(0);

  // 추천
  const [games, setGames]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [gameCount, setGameCount] = useState(1);
  const [saved, setSaved]       = useState(false);

  // 히스토리
  const [history, setHistory] = useState(() => LS.get("lotto_history", []));

  // 당첨 조회
  const [winRound, setWinRound]   = useState("");
  const [winResult, setWinResult] = useState(null);
  const [winLoading, setWinLoading] = useState(false);
  const [winError, setWinError]   = useState("");

  const stats = draws.length >= 10 ? analyzeDraws(draws) : null;

  // ── PWA 설치 / 업데이트 상태 ─────────────────
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner]   = useState(false);
  const [isInstalled, setIsInstalled]             = useState(false);

  useEffect(() => {
    // 이미 설치된 경우 감지 (standalone 모드)
    const mq = window.matchMedia("(display-mode: standalone)");
    setIsInstalled(mq.matches || navigator.standalone === true);
    const onMqChange = (e) => setIsInstalled(e.matches);
    mq.addEventListener("change", onMqChange);

    // 설치 프롬프트 이벤트 저장
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };

    // SW 업데이트 감지
    const onSwUpdate = () => setShowUpdateBanner(true);

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("sw-update-available", onSwUpdate);

    return () => {
      mq.removeEventListener("change", onMqChange);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("sw-update-available", onSwUpdate);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setShowInstallBanner(false);
    }
    setInstallPrompt(null);
  }

  function handleUpdate() {
    setShowUpdateBanner(false);
    window.location.reload();
  }

  // ── 당첨 데이터 수집 ──────────────────────────
  const fetchDraws = useCallback(async () => {
    setDrawsLoading(true);
    setDrawsProgress(0);
    setError("");

    const latest = estimateLatestRound();
    const targets = Array.from({ length: 100 }, (_, i) => latest - i).filter(
      (r) => r > 0
    );
    const results = [];
    const BATCH = 5;

    for (let i = 0; i < targets.length; i += BATCH) {
      const batch = targets.slice(i, i + BATCH);
      const fetched = await Promise.all(
        batch.map((r) => fetchDrawData(r).catch(() => null))
      );
      fetched.forEach((d) => { if (d) results.push(d); });
      setDrawsProgress(
        Math.min(100, Math.round(((i + BATCH) / targets.length) * 100))
      );
      // 서버 부하 방지
      await new Promise((r) => setTimeout(r, 200));
    }

    LS.set("lotto_draws", results);
    LS.set("lotto_draws_ts", Date.now());
    setDraws(results);
    setDrawsLoading(false);
  }, []);

  // 마운트 시 캐시 확인 → 24시간 지났으면 자동 갱신
  useEffect(() => {
    const ts = LS.get("lotto_draws_ts", 0);
    const stale = Date.now() - ts > 24 * 60 * 60 * 1000;
    if (draws.length < 10 || stale) {
      fetchDraws();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── AI 추천 ───────────────────────────────────
  async function handleRecommend() {
    if (!stats) {
      setError(lang === "ko" ? "당첨 데이터 로딩 후 추천이 가능합니다." : "Please wait for draw data to load.");
      return;
    }
    setLoading(true);
    setError("");
    setSaved(false);
    setGames([]);

    try {
      for (let i = 0; i < gameCount; i++) {
        const prompt = buildPrompt(stats, gameCount, history, i, lang);
        const result = await fetchAIRecommendation(prompt);
        setGames((prev) => [...prev, result]);
      }
    } catch (e) {
      setError(e.message || (lang === "ko" ? "AI 추천 중 오류가 발생했습니다. 다시 시도해주세요." : "AI error. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  // ── 저장 ─────────────────────────────────────
  function handleSave() {
    if (!games.length) return;
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("ko-KR"),
      games,
      numbers: games[0].numbers,
    };
    const newHistory = [entry, ...history];
    setHistory(newHistory);
    LS.set("lotto_history", newHistory);
    setSaved(true);
  }

  // ── 당첨 조회 ─────────────────────────────────
  async function handleWinCheck() {
    if (!winRound) return;
    setWinLoading(true);
    setWinResult(null);
    setWinError("");

    const d = await fetchDrawData(Number(winRound)).catch(() => null);
    if (d) {
      setWinResult(d);
    } else {
      setWinError(lang === "ko" ? "해당 회차 정보를 찾을 수 없습니다." : "Round not found.");
    }
    setWinLoading(false);
  }

  // ── 렌더 ─────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Noto+Sans+KR:wght@400;500;700&display=swap');
        @keyframes popIn {
          0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg);   opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #090912; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #f5c518; border-radius: 2px; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #090912 0%, #0e0e25 60%, #090912 100%)",
          fontFamily: "'Noto Sans KR', sans-serif",
          color: "#e0e0f0",
          paddingBottom: 90,
        }}
      >
        {/* ── PWA 업데이트 배너 ── */}
        {showUpdateBanner && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
            background: "linear-gradient(90deg, #1a2a1a, #0e1e0e)",
            borderBottom: "1px solid #66bb6a44",
            padding: "12px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            animation: "slideDown 0.3s ease",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}>
            <span style={{ fontSize: 13, color: "#a0e0a0" }}>
              {t.updateMsg}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleUpdate} style={{
                padding: "6px 14px", border: "none", borderRadius: 8,
                background: "#66bb6a", color: "#0a1a0a",
                fontWeight: 700, fontSize: 12, cursor: "pointer",
              }}>{t.updateBtn}</button>
              <button onClick={() => setShowUpdateBanner(false)} style={{
                padding: "6px 10px", border: "1px solid #2a3a2a", borderRadius: 8,
                background: "transparent", color: "#555", fontSize: 12, cursor: "pointer",
              }}>{t.updateLater}</button>
            </div>
          </div>
        )}

        {/* ── PWA 설치 배너 ── */}
        {showInstallBanner && !isInstalled && (
          <div style={{
            maxWidth: 480, margin: "0 auto",
            padding: "0 16px",
          }}>
            <div style={{
              background: "linear-gradient(135deg, #1a1a10, #14140a)",
              border: "1px solid #f5c51840",
              borderRadius: 14, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 12,
              animation: "slideDown 0.35s ease",
              marginBottom: 4,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg, #f5c518, #e6a800)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
              }}>🎱</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e0d090", marginBottom: 2 }}>
                  {t.installTitle}
                </div>
                <div style={{ fontSize: 11, color: "#888" }}>
                  {t.installSub}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button onClick={handleInstall} style={{
                  padding: "7px 14px", border: "none", borderRadius: 8,
                  background: "#f5c518", color: "#1a1a1a",
                  fontWeight: 700, fontSize: 12, cursor: "pointer",
                  whiteSpace: "nowrap",
                }}>{t.installBtn}</button>
                <button onClick={() => setShowInstallBanner(false)} style={{
                  padding: "5px 10px", border: "1px solid #2a2a1a",
                  borderRadius: 8, background: "transparent",
                  color: "#555", fontSize: 11, cursor: "pointer",
                }}>{t.installClose}</button>
              </div>
            </div>
          </div>
        )}

        {/* ── 헤더 ── */}
        <header style={{ textAlign: "center", padding: "36px 20px 18px", position: "relative" }}>
          <div
            style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 0%, #f5c51818 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />
          {/* 언어 토글 버튼 */}
          <button
            onClick={toggleLang}
            style={{
              position: "absolute", top: 16, right: 16,
              padding: "5px 12px", border: "1px solid #f5c51860",
              borderRadius: 20, background: "#14142a",
              color: "#f5c518", fontSize: 12, fontWeight: 700,
              cursor: "pointer", letterSpacing: 1,
              transition: "all 0.2s",
              zIndex: 10,
            }}
          >
            {lang === "ko" ? "EN" : "한"}
          </button>

          <h1
            style={{
              fontFamily: "'Black Han Sans', sans-serif",
              fontSize: 34, letterSpacing: 4,
              background: "linear-gradient(90deg, #e6a800, #f5c518, #ffed6f, #f5c518, #e6a800)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: "shimmer 3s linear infinite",
            }}
          >
            🎱 AI {lang === "ko" ? "로또" : "Lotto"}
          </h1>
          <p style={{ fontSize: 11, color: "#555", marginTop: 4, letterSpacing: 1 }}>
            {t.appSubtitle}
          </p>

          {/* 데이터 상태 배지 */}
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              marginTop: 10, padding: "5px 14px",
              background: draws.length >= 10 ? "#0a1e0a" : "#1a140a",
              border: `1px solid ${draws.length >= 10 ? "#2a4a2a" : "#3a2a0a"}`,
              borderRadius: 20, fontSize: 11,
              color: draws.length >= 10 ? "#66bb6a" : "#f5c518",
            }}
          >
            <div
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: draws.length >= 10 ? "#66bb6a" : "#f5c518",
                boxShadow: draws.length >= 10 ? "0 0 6px #66bb6a" : "0 0 6px #f5c518",
              }}
            />
            {drawsLoading
              ? t.dataLoading(drawsProgress)
              : draws.length >= 10
              ? t.dataReady(draws.length)
              : t.dataNone}
          </div>
        </header>

        {/* ── 프로그레스 바 ── */}
        {drawsLoading && (
          <div style={{ maxWidth: 480, margin: "0 auto 14px", padding: "0 16px" }}>
            <div
              style={{
                background: "#14142a", borderRadius: 12,
                padding: "14px 16px", border: "1px solid #22223a",
              }}
            >
              <div
                style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 12, color: "#666", marginBottom: 8,
                }}
              >
                <span>{t.dataApiLabel}</span>
                <span>{drawsProgress}%</span>
              </div>
              <div style={{ height: 6, background: "#0a0a1a", borderRadius: 3, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%", borderRadius: 3,
                    background: "linear-gradient(90deg, #f5c518, #ffed6f)",
                    width: `${drawsProgress}%`,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── 탭 네비게이션 ── */}
        <nav
          style={{
            display: "flex", maxWidth: 480,
            margin: "0 auto 20px", padding: "0 16px", gap: 6,
          }}
        >
          {[
            { id: "recommend", label: t.tabRecommend },
            { id: "stats",     label: t.tabStats },
            { id: "history",   label: t.tabHistory },
            { id: "win",       label: t.tabWin },
          ].map((tabItem) => (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              style={{
                flex: 1, padding: "10px 2px", border: "none", borderRadius: 12,
                background: tab === tabItem.id ? "#f5c518" : "#14142a",
                color: tab === tabItem.id ? "#1a1a1a" : "#555",
                fontFamily: "'Noto Sans KR', sans-serif",
                fontWeight: 700, fontSize: 11, cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: tab === tabItem.id ? "0 4px 16px #f5c51840" : "none",
              }}
            >
              {tabItem.label}
            </button>
          ))}
        </nav>

        {/* ── 탭 콘텐츠 ── */}
        <main style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px" }}>

          {/* ════════════════ 추천 탭 ════════════════ */}
          {tab === "recommend" && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>

              {/* 데이터 수집 버튼 */}
              {!drawsLoading && draws.length < 10 && (
                <button
                  onClick={fetchDraws}
                  style={{
                    width: "100%", padding: "14px",
                    border: "1px solid #f5c51840", borderRadius: 14,
                    background: "#12120a", color: "#f5c518",
                    fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 14,
                  }}
                >
                  {t.dataCollectBtn}
                </button>
              )}

              {/* 게임 수 선택 */}
              <div
                style={{
                  background: "#14142a", borderRadius: 14,
                  padding: "14px 18px", marginBottom: 14, border: "1px solid #22223a",
                }}
              >
                <div style={{ fontSize: 11, color: "#555", marginBottom: 10, letterSpacing: 1 }}>
                  {t.gameCountLabel}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {[1, 2, 3, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setGameCount(n)}
                      style={{
                        flex: 1, padding: "10px 0", border: "none", borderRadius: 10,
                        background: gameCount === n ? "#f5c518" : "#0a0a1a",
                        color: gameCount === n ? "#1a1a1a" : "#555",
                        fontFamily: "'Black Han Sans', sans-serif",
                        fontSize: 18, cursor: "pointer", transition: "all 0.2s",
                        boxShadow: gameCount === n ? "0 2px 10px #f5c51844" : "none",
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* 추천 버튼 */}
              <button
                onClick={handleRecommend}
                disabled={loading || !stats}
                style={{
                  width: "100%", padding: "18px", border: "none", borderRadius: 16,
                  background:
                    !stats || loading
                      ? "#1a1a2a"
                      : "linear-gradient(135deg, #e6a800 0%, #f5c518 40%, #ffed6f 70%, #e6a800 100%)",
                  color: !stats || loading ? "#444" : "#1a1a1a",
                  fontFamily: "'Black Han Sans', sans-serif",
                  fontSize: 20, letterSpacing: 2,
                  cursor: !stats || loading ? "not-allowed" : "pointer",
                  marginBottom: 18,
                  boxShadow: !stats || loading ? "none" : "0 6px 28px #f5c51855",
                  transition: "all 0.3s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                }}
              >
                {loading ? (
                  <>
                    <div
                      style={{
                        width: 20, height: 20,
                        border: "3px solid #333", borderTopColor: "#f5c518",
                        borderRadius: "50%", animation: "spin 0.8s linear infinite",
                      }}
                    />
                    {t.recommendLoading}
                  </>
                ) : !stats ? (
                  t.dataWaiting
                ) : (
                  t.recommendBtn
                )}
              </button>

              {/* 에러 메시지 */}
              {error && (
                <div
                  style={{
                    background: "#1e0a0a", border: "1px solid #ef535066",
                    borderRadius: 12, padding: "12px 16px", marginBottom: 16,
                    fontSize: 13, color: "#ef9090",
                  }}
                >
                  ⚠️ {error}
                </div>
              )}

              {/* 게임 결과 카드 */}
              {games.map((game, gi) => (
                <div
                  key={gi}
                  style={{
                    background: "linear-gradient(135deg, #14142a, #0e0e22)",
                    border: "1px solid #22224a", borderRadius: 20, padding: "20px",
                    marginBottom: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    animation: `fadeUp 0.4s ease ${gi * 0.05}s both`,
                  }}
                >
                  <div
                    style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Black Han Sans'", fontSize: 13,
                        color: "#f5c518", letterSpacing: 1,
                      }}
                    >
                      {games.length > 1 ? t.gameLabel(gi + 1) : t.recommendedLabel}
                    </div>
                    {game.strategy && (
                      <div
                        style={{
                          padding: "3px 10px", borderRadius: 20,
                          background: "#1e1e10", border: "1px solid #f5c51840",
                          fontSize: 10, color: "#f5c518",
                        }}
                      >
                        {game.strategy}
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex", gap: 8, justifyContent: "center",
                      flexWrap: "wrap", marginBottom: 16,
                    }}
                  >
                    {(game.numbers || []).map((n, i) => (
                      <LottoBall key={n} number={n} animated delay={i * 0.07} />
                    ))}
                  </div>

                  {game.reason && (
                    <div
                      style={{
                        background: "#0a0a1a", borderRadius: 10,
                        padding: "12px 14px", fontSize: 12,
                        color: "#999", lineHeight: 1.7,
                        borderLeft: "3px solid #f5c518",
                      }}
                    >
                      {t.aiReason}{game.reason}
                    </div>
                  )}
                </div>
              ))}

              {/* 로딩 중 스켈레톤 */}
              {loading && games.length < gameCount && (
                <div
                  style={{
                    background: "#14142a", borderRadius: 20, padding: "20px",
                    marginBottom: 14, border: "1px solid #22223a",
                    display: "flex", justifyContent: "center",
                    alignItems: "center", gap: 8, color: "#444", fontSize: 13,
                  }}
                >
                  <div
                    style={{
                      width: 16, height: 16,
                      border: "2px solid #333", borderTopColor: "#f5c518",
                      borderRadius: "50%", animation: "spin 0.8s linear infinite",
                    }}
                  />
                  {t.skeletonLabel(games.length + 1)}
                </div>
              )}

              {/* 저장 버튼 */}
              {games.length > 0 && (
                <button
                  onClick={handleSave}
                  disabled={saved}
                  style={{
                    width: "100%", padding: "14px",
                    border: `2px solid ${saved ? "#66bb6a" : "#f5c518"}`,
                    borderRadius: 14, background: "transparent",
                    color: saved ? "#66bb6a" : "#f5c518",
                    fontFamily: "'Noto Sans KR', sans-serif",
                    fontWeight: 700, fontSize: 15,
                    cursor: saved ? "default" : "pointer",
                    transition: "all 0.3s",
                  }}
                >
                  {saved ? t.savedBtn : t.saveBtn}
                </button>
              )}

              <p
                style={{
                  marginTop: 18, padding: "10px 14px",
                  background: "#0c0c1a", borderRadius: 10,
                  fontSize: 11, color: "#333", lineHeight: 1.7,
                }}
              >
                {t.disclaimer}
              </p>
            </div>
          )}

          {/* ════════════════ 통계 탭 ════════════════ */}
          {tab === "stats" && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              {!stats ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#444" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📡</div>
                  <div style={{ marginBottom: 10 }}>{t.statsNoData}</div>
                  <button
                    onClick={fetchDraws}
                    disabled={drawsLoading}
                    style={{
                      padding: "10px 24px", borderRadius: 10, border: "none",
                      background: "#f5c518", color: "#1a1a1a",
                      fontWeight: 700, fontSize: 14, cursor: "pointer",
                    }}
                  >
                    {t.statsCollectBtn(drawsProgress, drawsLoading)}
                  </button>
                </div>
              ) : (
                <>
                  {/* 요약 카드 */}
                  <div
                    style={{
                      display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 10, marginBottom: 16,
                    }}
                  >
                    {[
                      { label: t.statsSummaryRounds, value: t.statsRoundsUnit(stats.totalDraws) },
                      { label: t.statsSummaryAvg,    value: stats.avgSum },
                      {
                        label: t.statsSummaryOddEven,
                        value: `${Math.round((stats.odd / (stats.odd + stats.even || 1)) * 100)}:${Math.round((stats.even / (stats.odd + stats.even || 1)) * 100)}`,
                      },
                    ].map((c) => (
                      <div
                        key={c.label}
                        style={{
                          background: "#14142a", borderRadius: 12,
                          padding: "14px 10px", border: "1px solid #22223a",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "'Black Han Sans'",
                            fontSize: 20, color: "#f5c518",
                          }}
                        >
                          {c.value}
                        </div>
                        <div style={{ fontSize: 10, color: "#555", marginTop: 4 }}>
                          {c.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <SectionCard title={t.statsHot} color="#ef5350">
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {stats.hot.map((h) => (
                        <div
                          key={h.num}
                          style={{
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: 3,
                          }}
                        >
                          <LottoBall number={h.num} size={42} />
                          <span style={{ fontSize: 10, color: "#888" }}>{t.statsCountUnit(h.count)}</span>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title={t.statsOverdue} color="#4fc3f7">
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {stats.overdue.map((o) => (
                        <div
                          key={o.num}
                          style={{
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: 3,
                          }}
                        >
                          <LottoBall number={o.num} size={42} />
                          <span style={{ fontSize: 10, color: "#888" }}>{t.statsCountUnit(o.gap)}</span>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title={t.statsZone} color="#66bb6a">
                    {(() => {
                      const max = Math.max(...Object.values(stats.zones));
                      const zoneColors = ["#f5c518", "#4fc3f7", "#ef5350", "#9c9c9c", "#66bb6a"];
                      return Object.entries(stats.zones).map(([zone, count], ci) => (
                        <div
                          key={zone}
                          style={{
                            display: "flex", alignItems: "center",
                            gap: 10, marginBottom: 10,
                          }}
                        >
                          <div style={{ width: 44, fontSize: 11, color: "#777", textAlign: "right" }}>
                            {zone}
                          </div>
                          <div
                            style={{
                              flex: 1, height: 10,
                              background: "#0a0a1a", borderRadius: 5, overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%", borderRadius: 5,
                                background: zoneColors[ci],
                                width: `${max > 0 ? (count / max) * 100 : 0}%`,
                                transition: "width 0.8s ease",
                              }}
                            />
                          </div>
                          <div style={{ width: 36, fontSize: 11, color: "#666", textAlign: "right" }}>{t.statsCountUnit(count)}</div>
                        </div>
                      ));
                    })()}
                  </SectionCard>

                  <SectionCard title={t.statsFreq} color="#9c6bcc">
                    {(() => {
                      const maxCount = Math.max(...stats.freqArr.map((s) => s.count));
                      return [...stats.freqArr]
                        .sort((a, b) => b.count - a.count)
                        .map((s) => (
                          <div
                            key={s.num}
                            style={{
                              display: "flex", alignItems: "center",
                              gap: 8, marginBottom: 7,
                            }}
                          >
                            <LottoBall number={s.num} size={28} />
                            <div
                              style={{
                                flex: 1, height: 7,
                                background: "#0a0a1a", borderRadius: 3, overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%", borderRadius: 3,
                                  background: getBallColor(s.num).bg,
                                  width: `${maxCount > 0 ? (s.count / maxCount) * 100 : 0}%`,
                                  transition: "width 0.6s ease",
                                }}
                              />
                            </div>
                            <span style={{ width: 22, fontSize: 11, color: "#555", textAlign: "right" }}>
                              {s.count}
                            </span>
                          </div>
                        ));
                    })()}
                  </SectionCard>

                  <button
                    onClick={fetchDraws}
                    disabled={drawsLoading}
                    style={{
                      width: "100%", padding: "12px",
                      border: "1px solid #22223a", borderRadius: 12,
                      background: "transparent", color: "#555",
                      fontSize: 13, cursor: "pointer",
                    }}
                  >
                    {t.dataRefresh}
                  </button>
                </>
              )}
            </div>
          )}

          {/* ════════════════ 히스토리 탭 ════════════════ */}
          {tab === "history" && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              {history.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#444" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                  <div>{t.historyEmpty}</div>
                  <div style={{ fontSize: 12, marginTop: 6 }}>
                    {t.historyEmptySub}
                  </div>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginBottom: 14,
                    }}
                  >
                    <div style={{ fontSize: 13, color: "#666" }}>
                      {t.historyTotal(history.length)}
                    </div>
                    <button
                      onClick={() => {
                        setHistory([]);
                        LS.set("lotto_history", []);
                      }}
                      style={{
                        background: "none", border: "1px solid #22223a",
                        borderRadius: 8, padding: "6px 12px",
                        color: "#555", fontSize: 12, cursor: "pointer",
                      }}
                    >
                      {t.historyClearAll}
                    </button>
                  </div>

                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      style={{
                        background: "#14142a", borderRadius: 16,
                        padding: "16px", marginBottom: 12, border: "1px solid #22223a",
                      }}
                    >
                      <div style={{ fontSize: 11, color: "#555", marginBottom: 12 }}>
                        📅 {entry.date}
                      </div>
                      {(entry.games || [{ numbers: entry.numbers }]).map((g, gi) => (
                        <div
                          key={gi}
                          style={{
                            marginBottom:
                              gi < (entry.games?.length || 1) - 1 ? 12 : 0,
                          }}
                        >
                          {(entry.games?.length || 0) > 1 && (
                            <div style={{ fontSize: 10, color: "#444", marginBottom: 6 }}>
                              {t.historyGameLabel(gi + 1, g.strategy)}
                            </div>
                          )}
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {(g.numbers || []).map((n) => (
                              <LottoBall key={n} number={n} size={40} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* ════════════════ 당첨 조회 탭 ════════════════ */}
          {tab === "win" && (
            <div style={{ animation: "fadeUp 0.3s ease" }}>
              <div
                style={{
                  background: "#14142a", borderRadius: 16,
                  padding: "20px", border: "1px solid #22223a", marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
                  {t.winInputLabel}
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <input
                    type="number"
                    {...{placeholder: t.winPlaceholder}}
                    value={winRound}
                    onChange={(e) => setWinRound(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleWinCheck()}
                    style={{
                      flex: 1, padding: "12px 16px",
                      background: "#0a0a1a", border: "1px solid #2a2a40",
                      borderRadius: 10, color: "#e0e0f0",
                      fontFamily: "'Noto Sans KR', sans-serif",
                      fontSize: 15, outline: "none",
                    }}
                  />
                  <button
                    onClick={handleWinCheck}
                    disabled={winLoading || !winRound}
                    style={{
                      padding: "12px 20px", border: "none", borderRadius: 10,
                      background: winRound ? "#f5c518" : "#1a1a2a",
                      color: winRound ? "#1a1a1a" : "#444",
                      fontFamily: "'Black Han Sans', sans-serif",
                      fontSize: 15,
                      cursor: winRound ? "pointer" : "not-allowed",
                      transition: "all 0.2s",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      minWidth: 56,
                    }}
                  >
                    {winLoading ? (
                      <div
                        style={{
                          width: 16, height: 16,
                          border: "2px solid #333", borderTopColor: "#1a1a1a",
                          borderRadius: "50%", animation: "spin 0.8s linear infinite",
                        }}
                      />
                    ) : (
                      t.winQueryBtn
                    )}
                  </button>
                </div>
                <button
                  onClick={() => setWinRound(String(estimateLatestRound()))}
                  style={{
                    background: "none", border: "none",
                    color: "#f5c51880", fontSize: 12,
                    cursor: "pointer", padding: 0,
                  }}
                >
                  {t.winAutoFill}
                </button>
              </div>

              {winError && (
                <div
                  style={{
                    background: "#1e0a0a", border: "1px solid #ef535066",
                    borderRadius: 12, padding: "12px 16px", marginBottom: 16,
                    fontSize: 13, color: "#ef9090",
                  }}
                >
                  ⚠️ {winError}
                </div>
              )}

              {winResult && (
                <div
                  style={{
                    background: "linear-gradient(135deg, #14142a, #0e0e20)",
                    border: "1px solid #f5c51830", borderRadius: 20, padding: "22px",
                    boxShadow: "0 8px 40px rgba(245,197,24,0.08)",
                    animation: "fadeUp 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "flex-start", marginBottom: 18,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "'Black Han Sans'",
                          fontSize: 22, color: "#f5c518",
                        }}
                      >
                        {t.winRound(winResult.round)}
                      </div>
                      <div style={{ fontSize: 12, color: "#555", marginTop: 3 }}>
                        {winResult.date}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "#555" }}>{t.winPrize1}</div>
                      <div
                        style={{
                          fontSize: 15, color: "#66bb6a",
                          fontWeight: 700, marginTop: 2,
                        }}
                      >
                        {t.winPrize1Unit(winResult.prize1)}
                      </div>
                      <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>
                        {t.winPrize1Cnt(winResult.prize1Cnt)}
                      </div>
                    </div>
                  </div>

                  {/* 당첨 번호 */}
                  <div
                    style={{
                      display: "flex", gap: 7,
                      alignItems: "center", flexWrap: "wrap", marginBottom: 8,
                    }}
                  >
                    {winResult.numbers.map((n, i) => (
                      <LottoBall key={n} number={n} animated delay={i * 0.07} />
                    ))}
                    <div style={{ fontSize: 18, color: "#444", margin: "0 2px" }}>+</div>
                    <LottoBall number={winResult.bonus} animated delay={0.5} />
                  </div>
                  <div style={{ fontSize: 11, color: "#555", marginBottom: 20 }}>
                    {t.winBonus(winResult.bonus)}
                  </div>

                  {/* 내 번호와 비교 */}
                  {history.length > 0 && (
                    <div style={{ borderTop: "1px solid #1e1e30", paddingTop: 16 }}>
                      <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
                        {t.winCompareTitle}
                      </div>
                      {history
                        .slice(0, 5)
                        .flatMap((entry) =>
                          (entry.games || [{ numbers: entry.numbers }]).map((g, gi) => {
                            const myNums = g.numbers || [];
                            const matches = myNums.filter((n) =>
                              winResult.numbers.includes(n)
                            );
                            const bonusMatch = myNums.includes(winResult.bonus);
                            const rank =
                              matches.length === 6
                                ? t.winRanks[0]
                                : matches.length === 5 && bonusMatch
                                ? t.winRanks[1]
                                : matches.length === 5
                                ? t.winRanks[2]
                                : matches.length === 4
                                ? t.winRanks[3]
                                : matches.length === 3
                                ? t.winRanks[4]
                                : null;
                            return (
                              <div
                                key={`${entry.id}-${gi}`}
                                style={{
                                  background: rank ? "#1a1a0a" : "#0a0a1a",
                                  border: `1px solid ${rank ? "#f5c51840" : "#1a1a2a"}`,
                                  borderRadius: 10, padding: "10px 12px", marginBottom: 8,
                                  display: "flex", alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div style={{ display: "flex", gap: 4 }}>
                                  {myNums.map((n) => (
                                    <LottoBall
                                      key={n} number={n} size={28}
                                      dimmed={!winResult.numbers.includes(n)}
                                    />
                                  ))}
                                </div>
                                <div
                                  style={{
                                    fontSize: 12, fontWeight: 700,
                                    color: rank ? "#f5c518" : "#444",
                                    whiteSpace: "nowrap", marginLeft: 8,
                                  }}
                                >
                                  {rank || t.winMatchCount(matches.length)}
                                  {bonusMatch && !rank ? t.winBonusMatch : ""}
                                </div>
                              </div>
                            );
                          })
                        )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>

        {/* ── 푸터 ── */}
        <footer style={{
          maxWidth: 480, margin: "40px auto 0",
          padding: "24px 16px 40px",
          borderTop: "1px solid #1a1a2e",
        }}>
          {/* 서비스 안내 */}
          <p style={{
            fontSize: 11, color: "#444", lineHeight: 1.7,
            marginBottom: 16, textAlign: "center",
          }}>
            {lang === "ko"
              ? "본 서비스는 통계·패턴 분석을 기반으로 한 정보 제공 서비스이며, 특정 회차의 당첨을 보장하지 않습니다."
              : "This service provides information based on statistical and pattern analysis and does not guarantee winning numbers."}
          </p>

          {/* 약관 링크 */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 16,
            marginBottom: 20, flexWrap: "wrap",
          }}>
            {[
              lang === "ko" ? "이용약관" : "Terms of Service",
              lang === "ko" ? "개인정보처리방침" : "Privacy Policy",
              lang === "ko" ? "청소년보호정책" : "Youth Protection",
            ].map((label) => (
              <span key={label} style={{
                fontSize: 11, color: "#555", cursor: "pointer",
                textDecoration: "underline", textUnderlineOffset: 3,
              }}>{label}</span>
            ))}
          </div>

          {/* 사업자 정보 */}
          <div style={{
            fontSize: 11, color: "#3a3a55", lineHeight: 2,
            textAlign: "center",
          }}>
            <div>
              {lang === "ko" ? "상호" : "Company"}: 팡팡기획 &nbsp;|&nbsp;
              {lang === "ko" ? "대표" : "CEO"}: 이원석 &nbsp;|&nbsp;
              {lang === "ko" ? "사업자등록번호" : "Reg. No"}: 611-34-01648
            </div>
            <div>
              {lang === "ko" ? "통신판매업신고" : "E-commerce"}: 제2025-전북완주-0230호
            </div>
            <div>
              {lang === "ko" ? "주소" : "Address"}: 전북특별자치도 완주군 고산면 서봉소농길 40-14
            </div>
            <div style={{ marginTop: 4 }}>
              {lang === "ko" ? "고객센터" : "Support"} ▼
            </div>
          </div>

          {/* 카피라이트 */}
          <p style={{
            fontSize: 11, color: "#333", textAlign: "center", marginTop: 16,
          }}>
            © 2026 팡팡로또. All rights reserved.
          </p>
        </footer>

      </div>
    </>
  );
}
