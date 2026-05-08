import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ChatRequest = {
  language?: "en" | "th";
  message?: string;
  messages?: Array<{ from: "luma" | "user"; text: string }>;
  context?: unknown;
  intelligence?: unknown;
};

const LUMA_INSTRUCTIONS = `
You are Luma, a warm wellness companion for RoutineSense AI.
You are not a doctor, therapist, or emergency service.

Your job:
- Fuse Bangkok context, AQI/heat, calendar load, sleep, energy, stress, and diary text.
- Give one small next action, not a generic motivational paragraph.
- If the user asks why, explain the exact signals.
- Be conversational, grounded, and humble.
- Never diagnose or prescribe treatment.
- If there is self-harm or immediate danger language, stop productivity advice and encourage emergency support or Thailand resources: 1323 and 02-713-6793.

Tone:
- English: human, concise, calm, specific. Say "I suggest" or "Let's try", not "You must".
- Thai: natural, friendly, can code-switch gently. Say "ผมว่า", "ลองดูมั้ย", "ถ้าโอเคนะ".
- Maximum 90 words unless the user asks for a report.
`;

export async function POST(request: Request) {
  const body = await request.json() as ChatRequest;
  const language = body.language === "th" ? "th" : "en";
  const message = body.message?.trim() ?? "";

  if (!message) {
    return NextResponse.json({
      success: false,
      error: "Missing message"
    }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      success: true,
      source: "fallback",
      text: fallbackReply(message, language, body)
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        instructions: LUMA_INSTRUCTIONS,
        input: buildPrompt(body, language),
        temperature: 0.55,
        max_output_tokens: 260
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json({
        success: true,
        source: "fallback",
        text: fallbackReply(message, language, body),
        note: `OpenAI responded ${response.status}: ${detail.slice(0, 180)}`
      });
    }

    const result = await response.json();
    const text = typeof result.output_text === "string" && result.output_text.trim()
      ? result.output_text.trim()
      : extractOutputText(result) ?? fallbackReply(message, language, body);

    return NextResponse.json({
      success: true,
      source: "openai",
      text
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      source: "fallback",
      text: fallbackReply(message, language, body),
      note: error instanceof Error ? error.message : "OpenAI request failed"
    });
  }
}

function buildPrompt(body: ChatRequest, language: "en" | "th") {
  const recentConversation = (body.messages ?? [])
    .slice(-8)
    .map((item) => `${item.from === "user" ? "Beam" : "Luma"}: ${item.text}`)
    .join("\n");

  return `
Language: ${language}

Current context JSON:
${JSON.stringify(body.context ?? {}, null, 2)}

Current intelligence JSON:
${JSON.stringify(body.intelligence ?? {}, null, 2)}

Recent conversation:
${recentConversation || "(none)"}

Beam just said:
${body.message}

Respond as Luma. Make the answer different based on Beam's actual words.
Give a concrete next step and, when useful, one gentle question.
`;
}

function extractOutputText(result: unknown): string | null {
  const textParts: string[] = [];
  const visit = (value: unknown) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    const record = value as Record<string, unknown>;
    if (record.type === "output_text" && typeof record.text === "string") {
      textParts.push(record.text);
    }
    Object.values(record).forEach(visit);
  };
  visit(result);
  return textParts.join("").trim() || null;
}

function fallbackReply(message: string, language: "en" | "th", body: ChatRequest) {
  const lower = message.toLowerCase();
  const context = body.context as { weather?: { aqi?: number; heatIndex?: number }; user?: { sleep?: { hours?: number }; energy?: number; stress?: number } } | undefined;
  const aqi = context?.weather?.aqi ?? 145;
  const sleep = context?.user?.sleep?.hours ?? 5;
  const energy = context?.user?.energy ?? 3;
  const stress = context?.user?.stress ?? 7;

  if (/(hurt myself|kill myself|suicide|not safe|ทำร้ายตัวเอง|อยากตาย|ไม่ปลอดภัย)/i.test(message)) {
    return language === "th"
      ? "ผมอยู่ตรงนี้นะ แต่เรื่องนี้สำคัญกว่าแผนวันนี้ ถ้าตอนนี้ไม่ปลอดภัย โทร 1323 หรือ 02-713-6793 หรืออยู่ใกล้คนที่ไว้ใจได้ทันทีนะ"
      : "I’m here with you. This is more important than today’s plan. If you feel unsafe, please contact emergency help or Thailand support at 1323 or 02-713-6793, and move near someone you trust now.";
  }

  if (lower.includes("why") || lower.includes("เหตุผล")) {
    return language === "th"
      ? `ผมดูจาก 4 สัญญาณ: AQI ${aqi}, นอน ${sleep} ชม., พลัง ${energy}/5, เครียด ${stress}/10 เลยไม่ได้แนะนำให้ฝืน แต่ให้ลดแรงเสียดทานก่อนช่วงบ่าย`
      : `I’m connecting four signals: AQI ${aqi}, ${sleep}h sleep, energy ${energy}/5, and stress ${stress}/10. That points to reducing friction before the afternoon, not pushing harder.`;
  }

  if (lower.includes("report") || lower.includes("summary") || lower.includes("weekly") || lower.includes("monthly")) {
    return language === "th"
      ? "สรุปแบบมนุษย์คือ: สัปดาห์นี้พลังไม่ได้ตกเพราะขี้เกียจ แต่เพราะฝุ่น + นอนน้อย + ตารางแน่นมาชนกัน จุดทดลองถัดไปคือกินก่อนเที่ยงและหยุดกาแฟก่อนบ่ายสอง"
      : "Human version: your energy didn’t drop because you were lazy. It dropped when air quality, short sleep, and a full calendar landed together. The next experiment is lunch before noon and caffeine before 2pm.";
  }

  if (lower.includes("easier") || lower.includes("tired") || lower.includes("เหนื่อย") || lower.includes("ง่าย")) {
    return language === "th"
      ? "ได้เลย ลดเหลือแค่หนึ่งอย่างก่อน: กินก่อนเที่ยง ถ้ายังมีแรงค่อยยืดในห้อง 3 นาที ไม่ต้องชนะทั้งวัน แค่กันไม่ให้บ่ายพังพอ"
      : "Absolutely. Let’s shrink it to one thing: eat before noon. If you still have energy, add three quiet indoor minutes. We’re not trying to win the whole day, just protect the afternoon.";
  }

  if (lower.includes("aqi") || lower.includes("air") || lower.includes("ฝุ่น")) {
    return language === "th"
      ? `วันนี้ให้ AQI ${aqi} เป็นข้อจำกัดหลักนะ ปิดหน้าต่าง เลี่ยง outdoor และย้าย movement เป็นในห้องแทน แบบนี้ยังดูแลตัวเองได้โดยไม่ฝืนเมือง`
      : `Let’s treat AQI ${aqi} as the main constraint today. Close windows, avoid outdoor exercise, and keep movement indoors. That still counts as care, without fighting the city.`;
  }

  return language === "th"
    ? "รับทราบ ผมจะจำวันนี้ว่าเป็นวันพลังเปราะ แล้วจัดแผนให้เล็กลง: มื้อจริงหนึ่งมื้อ งานสำคัญหนึ่งช่วง และพักสั้นก่อนบ่าย"
    : "Got it. I’ll remember today as a fragile-energy day and keep the plan small: one real meal, one important work block, and a short reset before the afternoon.";
}
