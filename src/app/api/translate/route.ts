import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const OPENAI_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_KEY) {
    return NextResponse.json({ 
      success: false, 
      error: "OpenAI API Key is missing in .env.local" 
    }, { status: 400 });
  }

  try {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: "Missing text or targetLanguage" }, { status: 400 });
    }

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Use faster model for translation
        messages: [
          { 
            role: "system", 
            content: `You are a professional UX writer. Translate the following text into ${targetLanguage}. Keep the tone calm, premium, and friendly. Preserve any markdown or emojis.` 
          },
          { role: "user", content: text }
        ],
        temperature: 0.3
      })
    });

    if (!res.ok) {
      throw new Error(`OpenAI API responded with status ${res.status}`);
    }

    const data = await res.json();
    const translatedText = data.choices[0]?.message?.content?.trim();

    return NextResponse.json({
      success: true,
      translatedText
    });

  } catch (error) {
    console.error("Translation API Error:", error);
    return NextResponse.json({ success: false, error: "Translation failed" }, { status: 500 });
  }
}
