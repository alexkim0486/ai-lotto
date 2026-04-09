// api/recommend.js
// Vercel Serverless Function — API 키를 서버사이드에서만 사용합니다.
// 클라이언트에 키가 절대 노출되지 않습니다.

export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 환경변수에서 API 키 로드 (절대 클라이언트로 전달 안 함)
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API 키가 서버에 설정되지 않았습니다." });
  }

  const { prompt, gameCount = 1 } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "prompt 필드가 필요합니다." });
  }
  if (prompt.length > 4000) {
    return res.status(400).json({ error: "prompt가 너무 깁니다." });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `당신은 로또 번호 추천 전문 AI입니다. 반드시 아래 JSON 형식으로만 응답하세요. 마크다운 없이 순수 JSON만 반환하세요.
{"numbers":[숫자6개],"reason":"추천 이유 (한국어, 3-4문장, 구체적 통계 수치 포함)","strategy":"전략명 (균형형/핫번호형/오버듀형/혼합형 중 하나)"}
규칙: numbers는 1~45 사이 서로 다른 정수 6개, 오름차순 정렬`,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return res.status(502).json({ error: "AI 서비스 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
    }

    const data = await response.json();
    const raw = (data.content || []).map((b) => b.text || "").join("");
    const clean = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      console.error("JSON parse error:", clean);
      return res.status(502).json({ error: "AI 응답을 파싱할 수 없습니다. 다시 시도해주세요." });
    }

    // 응답 검증: numbers 배열 체크
    if (
      !Array.isArray(parsed.numbers) ||
      parsed.numbers.length !== 6 ||
      parsed.numbers.some((n) => typeof n !== "number" || n < 1 || n > 45)
    ) {
      return res.status(502).json({ error: "AI가 올바른 번호를 생성하지 못했습니다. 다시 시도해주세요." });
    }

    // 중복 제거 검증
    const unique = new Set(parsed.numbers);
    if (unique.size !== 6) {
      return res.status(502).json({ error: "AI가 중복 번호를 생성했습니다. 다시 시도해주세요." });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
}
