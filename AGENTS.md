# RoutineSense AI Project Instructions

RoutineSense AI is a hackathon MVP for "Wellness AI in the Post-AGI Era."

Core product sentence:
RoutineSense learns what silently breaks your energy, then helps you act before the day goes off track.

Before making product, architecture, or UX decisions, read:
- docs/project-context.md
- docs/architecture.md

Product rules:
- This is a wellness and energy copilot, not a medical diagnosis, therapy, or treatment product.
- Keep the experience mobile-first, calm, practical, and demo-safe.
- Prefer one companion thread, one orb/avatar surface, one clear daily action card.
- Every recommendation must include one primary action, one backup action, and a plain-language reason.
- Use starter-memory language: "in the last 7 days", "early pattern", "does this feel true?"
- Never claim causality from seven days of data.
- Safety flow must interrupt normal coaching when self-harm intent or acute danger appears.
- Privacy must be visible: minimal storage, clear deletion controls, no selling or sharing wellness data.

Engineering rules:
- Use Next.js, TypeScript, and Tailwind.
- Keep AI calls behind server-side APIs or mockable service boundaries.
- Use deterministic logic for starter pattern scoring; use LLMs for extraction and generation.
- Ship stable push-to-talk or text-first flows before attempting live realtime voice.
- Include seed data and five demo scenarios for judging.
- Keep README current with setup, demo script, architecture, and safety notes.
