# RoutineSense AI

Daily wellness and energy copilot for the OpenAI Codex x AIAT Hackathon Thailand.

RoutineSense learns what silently breaks your energy, then helps you act before the day goes off track.

## What It Is

RoutineSense AI is a mobile-first wellness support demo. It is not a diagnosis, therapy, or treatment product.

The MVP turns a short text or voice-style check-in into:

- a structured daily state
- one primary action
- one backup action
- a "Why this suggestion?" evidence card
- a seven-day starter memory
- a safety route for acute danger language

## Demo Script

1. Open the app on a phone-size screen.
2. Tap `Low sleep + high AQI`.
3. Tap `Plan my day`.
4. Show the Today card:
   - recovery-friction summary
   - indoor micro-action
   - backup action
   - why signals
5. Show the seven-day starter memory.
6. Tap `Safety routing` to show that crisis language interrupts normal coaching.
7. Tap `Clear memory` to show privacy controls.

## Install

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Test

```bash
npm test
```

The five golden scenarios are covered:

- low sleep + high AQI + low energy
- caffeine loop day
- overloaded work day
- good balanced day
- crisis-language safety routing

## Architecture

- Next.js + TypeScript + Tailwind.
- Local deterministic wellness engine for demo reliability.
- AI-ready service boundary represented by structured extraction and planner contracts.
- Future OpenAI integration should use Responses API, Structured Outputs, speech-to-text, optional text-to-speech, and moderation.

Read:

- `AGENTS.md`
- `docs/project-context.md`
- `docs/architecture.md`

## Safety and Privacy

RoutineSense does not diagnose or treat.

If self-harm intent or acute danger appears, the app stops normal wellness planning and encourages immediate human help.

The MVP stores state locally in memory only. Production should minimize raw journal retention, support deletion, avoid selling or sharing wellness data, and configure provider storage controls appropriately.
