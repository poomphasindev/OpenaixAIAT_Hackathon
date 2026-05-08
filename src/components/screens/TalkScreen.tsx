"use client";

import { Bot, Check, ChevronDown, Loader2, Mic, Send, Sparkles, Square, Wand2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ContextLayer, IntelligenceOutput, Language } from "@/lib/types";

type ResponseSource = "openai" | "fallback" | "local";

type Message = {
  id: string;
  from: "luma" | "user";
  text: string;
  showReasoning?: boolean;
  source?: ResponseSource;
};

const COPY = {
  th: {
    title: "คุยกับ Luma",
    subtitle: "พูดหรือพิมพ์สิ่งที่เปลี่ยนไป แล้ว Luma จะปรับแผนจากบริบทจริงของวันนี้",
    ready: "ผมมีบริบทเช้านี้แล้ว เล่าได้เลยว่าวันนี้อะไรต่างจากแผน",
    voiceIdle: "แตะเพื่ออัดเสียง",
    voiceOn: "กำลังอัดเสียง แตะอีกครั้งเพื่อส่ง",
    voiceProcessing: "กำลังถอดเสียงด้วย OpenAI...",
    voiceDone: "ถอดเสียงเสร็จแล้ว",
    voiceUnsupported: "เบราว์เซอร์นี้ยังอัดเสียงไม่ได้ พิมพ์แทนได้เลย",
    voiceError: "ยังถอดเสียงไม่สำเร็จ ลองอัดใหม่หรือพิมพ์แทนได้เลย",
    placeholder: "เช่น I feel anxious because the air is bad...",
    send: "ส่ง",
    reasoning: "ดูเหตุผล",
    hide: "ซ่อนเหตุผล",
    quick: "ลองถามแบบนี้",
    saved: "บันทึกเข้า memory แล้ว",
    save: "Save memory",
    thinking: "Luma กำลังคิดจากบริบทวันนี้...",
    sourceOpenai: "OpenAI response",
    sourceFallback: "Local fallback",
    sourceLocal: "Demo seed",
    chips: ["Make it easier", "Why this plan?", "Plan around Bangkok AQI", "Write my weekly report"]
  },
  en: {
    title: "Talk with Luma",
    subtitle: "Say what changed. Luma turns today’s air, sleep, calendar, and diary into one practical plan.",
    ready: "I’ve got the morning context. Tell me what feels different from the plan.",
    voiceIdle: "Tap to record",
    voiceOn: "Recording. Tap again to transcribe",
    voiceProcessing: "Transcribing with OpenAI...",
    voiceDone: "Transcript ready",
    voiceUnsupported: "Voice recording is not available in this browser. Text still works.",
    voiceError: "I could not transcribe that yet. Try again or type it in.",
    placeholder: "Try: I feel anxious because the air is bad...",
    send: "Send",
    reasoning: "Show why",
    hide: "Hide why",
    quick: "Try asking",
    saved: "Saved to memory",
    save: "Save memory",
    thinking: "Luma is thinking with today’s context...",
    sourceOpenai: "OpenAI response",
    sourceFallback: "Local fallback",
    sourceLocal: "Demo seed",
    chips: ["Make it easier", "Why this plan?", "Plan around Bangkok AQI", "Write my weekly report"]
  }
} satisfies Record<Language, {
  title: string;
  subtitle: string;
  ready: string;
  voiceIdle: string;
  voiceOn: string;
  voiceProcessing: string;
  voiceDone: string;
  voiceUnsupported: string;
  voiceError: string;
  placeholder: string;
  send: string;
  reasoning: string;
  hide: string;
  quick: string;
  saved: string;
  save: string;
  thinking: string;
  sourceOpenai: string;
  sourceFallback: string;
  sourceLocal: string;
  chips: string[];
}>;

export function TalkScreen({
  context,
  intelligence,
  checkin,
  language,
  onCheckin,
  onSaveMemory
}: {
  context: ContextLayer;
  intelligence: IntelligenceOutput;
  checkin: string;
  language: Language;
  onCheckin: (value: string) => void;
  onSaveMemory: () => void;
}) {
  const copy = COPY[language];
  const [draft, setDraft] = useState(checkin);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [saved, setSaved] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState(copy.voiceIdle);
  const [messages, setMessages] = useState<Message[]>(() => initialMessages(copy.ready, checkin, language, intelligence));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const latestContext = useMemo(() => ({
    weather: context.weather,
    calendar: {
      intensity: context.calendar.intensity,
      events: context.calendar.events.map((event) => ({
        title: event.title,
        type: event.type,
        startTime: event.startTime,
        energyImpact: event.energyImpact,
        lumaNote: event.lumaNote
      }))
    },
    user: context.user
  }), [context]);

  useEffect(() => {
    setVoiceStatus(copy.voiceIdle);
  }, [copy.voiceIdle]);

  useEffect(() => () => {
    stopStream();
  }, []);

  async function sendMessage(text = draft) {
    const clean = text.trim();
    if (!clean || isThinking) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      from: "user",
      text: clean
    };
    const conversationForApi = [...messages, userMessage].slice(-8);

    setMessages((current) => [...current, userMessage]);
    onCheckin(clean);
    setDraft("");
    setSaved(false);
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          message: clean,
          messages: conversationForApi.map(({ from, text }) => ({ from, text })),
          context: latestContext,
          intelligence
        })
      });
      const payload = await response.json() as { success?: boolean; source?: ResponseSource; text?: string; error?: string };
      const replyText = payload.success && payload.text
        ? payload.text
        : buildLocalFallback(clean, language, intelligence, context);

      setMessages((current) => [
        ...current,
        {
          id: `l-${Date.now()}`,
          from: "luma",
          text: replyText,
          showReasoning: true,
          source: payload.source === "openai" ? "openai" : payload.source === "fallback" ? "fallback" : "local"
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `l-${Date.now()}`,
          from: "luma",
          text: buildLocalFallback(clean, language, intelligence, context),
          showReasoning: true,
          source: "local"
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  }

  async function toggleVoice() {
    if (isListening) {
      stopRecording();
      return;
    }
    await startRecording();
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setVoiceStatus(copy.voiceUnsupported);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      streamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        stopStream();
        setIsListening(false);
        void transcribeAudio(blob);
      };

      recorder.start();
      setIsListening(true);
      setVoiceStatus(copy.voiceOn);
    } catch {
      setIsListening(false);
      setVoiceStatus(copy.voiceError);
      stopStream();
    }
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;
    setVoiceStatus(copy.voiceProcessing);
    if (recorder && recorder.state === "recording") {
      recorder.stop();
    } else {
      setIsListening(false);
      stopStream();
    }
  }

  async function transcribeAudio(blob: Blob) {
    if (blob.size < 1200) {
      setVoiceStatus(copy.voiceError);
      return;
    }

    setVoiceStatus(copy.voiceProcessing);
    const formData = new FormData();
    const extension = blob.type.includes("mp4") ? "m4a" : blob.type.includes("ogg") ? "ogg" : "webm";
    formData.append("audio", blob, `routinesense-voice.${extension}`);
    formData.append("language", language);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData
      });
      const payload = await response.json() as { success?: boolean; text?: string };
      const transcript = payload.text?.trim();
      if (!response.ok || !payload.success || !transcript) {
        throw new Error("Empty transcript");
      }
      setDraft(transcript);
      setVoiceStatus(copy.voiceDone);
      await sendMessage(transcript);
    } catch {
      setVoiceStatus(copy.voiceError);
    }
  }

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
  }

  function handleQuickReply(label: string) {
    const text = language === "th"
      ? `${label}: ช่วยปรับแผนวันนี้ให้ตอบโจทย์กว่านี้`
      : `${label}: adjust today's plan using my current context`;
    setDraft(text);
    void sendMessage(text);
  }

  function saveMemory() {
    onCheckin(draft.trim() || checkin);
    onSaveMemory();
    setSaved(true);
  }

  return (
    <div className="screen-fade px-4 pb-36 space-y-3">
      <header className="pt-1">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-moss/70">Talk</p>
        <h1 className="text-2xl font-black leading-tight text-ink">{copy.title}</h1>
        <p className="mt-1 text-xs font-bold leading-5 text-ink/50">{copy.subtitle}</p>
      </header>

      <section className="talk-surface">
        <div className="space-y-3">
          {messages.map((message) => (
            <TalkBubble key={message.id} message={message} intelligence={intelligence} language={language} />
          ))}
          {isThinking && (
            <article className="talk-bubble talk-bubble-luma">
              <div className="flex items-center gap-2 text-sm font-black text-ink/64">
                <Loader2 size={16} className="animate-spin text-moss" />
                {copy.thinking}
              </div>
            </article>
          )}
        </div>
      </section>

      <section className="app-panel">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-moss">{copy.quick}</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {copy.chips.map((chip) => (
            <button key={chip} className="quick-chip" onClick={() => handleQuickReply(chip)}>
              {chip}
            </button>
          ))}
        </div>
      </section>

      <section className="voice-dock">
        <button className={`voice-orb ${isListening ? "voice-orb-active" : ""}`} onClick={toggleVoice} aria-label={isListening ? copy.voiceOn : copy.voiceIdle}>
          {isListening ? <Square size={22} /> : <Mic size={24} />}
          <span className="voice-ripple" />
          <span className="voice-ripple voice-ripple-two" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-moss">{voiceStatus}</p>
          <textarea
            className="mt-2 min-h-20 w-full resize-none rounded-2xl border border-white/70 bg-white/72 px-3 py-2 text-sm font-bold leading-6 text-ink outline-none placeholder:text-ink/32"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={copy.placeholder}
          />
          <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
            <button className="min-h-11 rounded-2xl bg-mint px-4 text-xs font-black text-moss" onClick={saveMemory}>
              {saved ? copy.saved : copy.save}
            </button>
            <button
              className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-ink px-4 text-xs font-black text-white disabled:opacity-45"
              onClick={() => void sendMessage()}
              disabled={isThinking}
            >
              {isThinking ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {copy.send}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function TalkBubble({
  message,
  intelligence,
  language
}: {
  message: Message;
  intelligence: IntelligenceOutput;
  language: Language;
}) {
  const [open, setOpen] = useState(Boolean(message.showReasoning));
  const copy = COPY[language];
  const isLuma = message.from === "luma";

  return (
    <article className={isLuma ? "talk-bubble talk-bubble-luma" : "talk-bubble talk-bubble-user"}>
      <div className="mb-2 flex items-center gap-2">
        <span className={isLuma ? "grid h-7 w-7 place-items-center rounded-xl bg-mint text-moss" : "grid h-7 w-7 place-items-center rounded-xl bg-ink text-white"}>
          {isLuma ? <Bot size={14} /> : <Wand2 size={14} />}
        </span>
        <p className="text-[10px] font-black uppercase tracking-[0.16em] opacity-60">{isLuma ? "Luma" : "Beam"}</p>
        {isLuma && message.source && (
          <span className="ml-auto rounded-full bg-paper px-2 py-1 text-[9px] font-black uppercase tracking-wide text-ink/45">
            {message.source === "openai"
              ? copy.sourceOpenai
              : message.source === "fallback"
                ? copy.sourceFallback
                : copy.sourceLocal}
          </span>
        )}
      </div>
      <p className="text-sm font-bold leading-6">{message.text}</p>
      {isLuma && (
        <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-black text-ink/60" onClick={() => setOpen((value) => !value)}>
          <Sparkles size={12} />
          {open ? copy.hide : copy.reasoning}
          <ChevronDown size={12} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
        </button>
      )}
      {isLuma && open && (
        <div className="mt-3 space-y-1.5">
          {intelligence.reasoningTrail.slice(0, 4).map((item) => (
            <div key={item} className="rounded-xl bg-white/70 px-3 py-2 text-[11px] font-bold leading-5 text-ink/56">
              {item}
            </div>
          ))}
          <div className="inline-flex items-center gap-2 rounded-xl bg-mint/55 px-3 py-2 text-[11px] font-black text-moss">
            <Check size={12} />
            {intelligence.prediction.confidence}% confidence
          </div>
        </div>
      )}
    </article>
  );
}

function initialMessages(ready: string, checkin: string, language: Language, intelligence: IntelligenceOutput): Message[] {
  return [
    {
      id: "luma-ready",
      from: "luma",
      text: ready,
      showReasoning: false,
      source: "local"
    },
    {
      id: "user-seed",
      from: "user",
      text: checkin
    },
    {
      id: "luma-plan",
      from: "luma",
      text: buildOpeningReply(language, intelligence),
      showReasoning: true,
      source: "local"
    }
  ];
}

function buildOpeningReply(language: Language, intelligence: IntelligenceOutput) {
  return language === "th"
    ? `ผมปรับแผนวันนี้ให้เล็กและทำได้จริงก่อน: ${intelligence.recommendation.primary}`
    : `Here’s the practical version for today: ${intelligence.recommendation.primary}`;
}

function buildLocalFallback(text: string, language: Language, intelligence: IntelligenceOutput, context: ContextLayer) {
  const lower = text.toLowerCase();
  if (lower.includes("why") || lower.includes("เหตุผล")) {
    return language === "th"
      ? `เหตุผลหลักคือ AQI ${context.weather.aqi}, นอน ${context.user.sleep.hours} ชม., พลัง ${context.user.energy}/5 และตาราง ${context.calendar.intensity} ผมเลยกันช่วงบ่ายไว้ก่อน`
      : `The main signals are AQI ${context.weather.aqi}, ${context.user.sleep.hours}h sleep, energy ${context.user.energy}/5, and a ${context.calendar.intensity} calendar. That is why I’m protecting the afternoon instead of pushing harder.`;
  }

  if (lower.includes("report") || lower.includes("weekly") || lower.includes("monthly") || lower.includes("summary")) {
    return language === "th"
      ? "สรุปแบบมนุษย์: พลังตกเมื่อฝุ่น นอนน้อย และตารางแน่นมาชนกัน จุดทดลองถัดไปคือมื้อเที่ยงก่อน 12:00 และกาแฟก่อนบ่ายสอง"
      : "Human version: the dips show up when poor air, short sleep, and a full calendar collide. The next experiment is lunch before noon and caffeine before 2pm.";
  }

  if (lower.includes("easier") || lower.includes("tired") || lower.includes("เหนื่อย") || lower.includes("ง่าย")) {
    return language === "th"
      ? "ได้เลย ลดเหลือหนึ่งอย่างก่อน: กินก่อนเที่ยง ถ้ายังมีแรงค่อยยืดในห้อง 3 นาที วันนี้ไม่ต้องชนะทั้งวัน แค่กันบ่ายไม่พังก็พอ"
      : "Absolutely. Let’s shrink it to one thing: eat before noon. If you still have energy, add three quiet indoor minutes. Today is about protecting the afternoon, not winning the whole day.";
  }

  if (lower.includes("aqi") || lower.includes("air") || lower.includes("ฝุ่น")) {
    return language === "th"
      ? `วันนี้ให้ AQI ${context.weather.aqi} เป็นข้อจำกัดหลัก: ปิดหน้าต่าง เลี่ยง outdoor และย้าย movement เป็นในห้อง`
      : `Let’s treat AQI ${context.weather.aqi} as the main constraint: close windows, avoid outdoor exercise, and keep movement indoors. That still counts as taking care of yourself.`;
  }

  return language === "th"
    ? `รับทราบ ผมจะจำวันนี้ว่าเป็นวันพลังเปราะ แล้วจัดแผนให้เล็กลง: ${intelligence.recommendation.primary}`
    : `Got it. I’ll remember today as a fragile-energy day and keep the plan small: ${intelligence.recommendation.primary}`;
}
