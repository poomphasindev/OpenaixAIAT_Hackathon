# Architecture

## Stack

- Next.js + TypeScript.
- Tailwind CSS.
- Local seed data and browser persistence for hackathon demo reliability.
- Server-side AI service boundary for future OpenAI integration.

## AI Responsibilities

Use AI for:
- Speech-to-text for voice notes.
- Structured extraction from diary or check-in text.
- Natural-language planning and summarization.
- Optional text-to-speech playback.

Use deterministic code for:
- Starter pattern scoring.
- Crisis keyword routing before normal planning.
- Confidence labels.
- Demo scenario generation.

## Data Model

user_profile:
- id
- name
- preferences
- privacy settings

daily_checkin:
- id
- date
- moment: morning | afternoon | evening
- raw_text
- source: text | voice

extracted_state:
- mood
- energy
- stress
- sleep_quality
- caffeine
- meals
- movement
- work_load
- social_load
- environment_context
- friction_reason
- tomorrow_intent
- help_request

pattern_memory:
- id
- label
- signal summary
- evidence count
- confidence
- user confirmation state

recommendation:
- id
- summary
- primary_action
- backup_action
- why_signals
- follow_up_question
- safety_state

recommendation_feedback:
- recommendation_id
- helpful: yes | no | unsure
- note

## Safety

If input includes self-harm intent or acute danger:
- Stop normal wellness planning.
- Show a concise supportive message.
- Encourage immediate human help and emergency resources.
- Do not ask the user to continue normal productivity planning.

## Privacy

- Make privacy visible in settings.
- Provide clear memory deletion controls.
- Separate raw journal text from derived tags.
- State that data is not sold or shared.
- For production, set AI provider request storage controls appropriately and minimize retained raw text.
