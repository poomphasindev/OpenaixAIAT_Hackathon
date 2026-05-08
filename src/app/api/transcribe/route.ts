import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();
  const audio = formData.get("audio");
  const language = formData.get("language");

  if (!(audio instanceof File)) {
    return NextResponse.json({
      success: false,
      error: "Missing audio file"
    }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      success: true,
      source: "fallback",
      text: language === "th"
        ? "ผมนอนน้อย อากาศหนัก และอยากให้วันนี้แผนเล็กลง"
        : "I slept badly, the air feels heavy, and I need a smaller plan today.",
      note: "OPENAI_API_KEY is not set, so RoutineSense returned a demo transcript."
    });
  }

  const upstreamForm = new FormData();
  upstreamForm.append("file", audio, audio.name || "routinesense-voice.webm");
  upstreamForm.append("model", process.env.OPENAI_TRANSCRIBE_MODEL ?? "gpt-4o-mini-transcribe");
  upstreamForm.append("response_format", "json");
  if (language === "en" || language === "th") {
    upstreamForm.append("language", language);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: upstreamForm
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json({
        success: false,
        error: `OpenAI transcription failed with ${response.status}`,
        detail: detail.slice(0, 240)
      }, { status: 502 });
    }

    const result = await response.json() as { text?: string };
    return NextResponse.json({
      success: true,
      source: "openai",
      text: result.text?.trim() ?? ""
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Transcription request failed"
    }, { status: 500 });
  }
}
