// api/draw.js
// 동행복권 API를 서버사이드에서 호출 — CORS 문제를 완전히 해결합니다.
// allorigins 같은 외부 프록시 없이 직접 호출합니다.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { round } = req.query;
  const roundNum = parseInt(round, 10);

  if (!round || isNaN(roundNum) || roundNum < 1 || roundNum > 9999) {
    return res.status(400).json({ error: "유효하지 않은 회차 번호입니다." });
  }

  try {
    const url = `https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${roundNum}`;
    const response = await fetch(url, {
      headers: {
        // 봇 차단 우회를 위한 User-Agent
        "User-Agent": "Mozilla/5.0 (compatible; LottoApp/1.0)",
        "Referer": "https://www.dhlottery.co.kr/",
      },
    });

    if (!response.ok) {
      return res.status(502).json({ error: "동행복권 서버 오류" });
    }

    const json = await response.json();

    if (json.returnValue !== "success") {
      return res.status(404).json({ error: "해당 회차 데이터를 찾을 수 없습니다." });
    }

    const result = {
      round:     json.drwNo,
      date:      json.drwNoDate,
      numbers:   [json.drwtNo1, json.drwtNo2, json.drwtNo3, json.drwtNo4, json.drwtNo5, json.drwtNo6],
      bonus:     json.bnusNo,
      prize1:    json.firstWinamnt,
      prize1Cnt: json.firstPrzwnerCo,
    };

    // 캐시 헤더: 과거 회차는 불변 데이터이므로 길게 캐시
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
    return res.status(200).json(result);
  } catch (err) {
    console.error("Draw fetch error:", err);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}
