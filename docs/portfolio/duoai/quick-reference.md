# DuoAI — Quick Reference Snippets

**Purpose:** Copy-paste proof points for proposals involving computer vision, voice AI, gaming, or multi-modal interaction.

---

## One-Line Description

> Intelligent gaming companion that watches your screen, listens to voice commands, and provides real-time AI coaching with <2s response latency using Claude vision + ElevenLabs TTS.

---

## Proof Points (Copy-Paste)

### For Computer Vision / Screen Capture

```
We built DuoAI, a gaming companion that captures your screen in real-time, analyzes gameplay with Claude vision API, and provides contextual coaching. It detects game state (UI elements, player status, enemy positions) and responds to what it sees with specific advice, not generic tips. 49 Vercel deployments prove real-time vision AI works in production.
```

### For Voice AI / Multi-Modal Interaction

```
DuoAI combines three modalities in <2s: screen capture (Claude vision), voice commands (speech-to-text), and spoken coaching (ElevenLabs turbo v2.5 TTS). Players ask questions while playing, and DuoAI responds with contextual advice hands-free. Real-time coordination of vision + voice + AI reasoning in a serverless architecture.
```

### For Gaming AI / Esports Coaching

```
DuoAI provides real-time in-game coaching by watching your screen and listening to your questions. It uses game-specific knowledge bases (tech trees, strategies, unit stats) combined with Claude vision analysis to give tactical advice mid-match. Not a generic chatbot—it sees what you see and knows the game rules.
```

### For ElevenLabs Integration

```
DuoAI uses ElevenLabs eleven_turbo_v2_5 for sub-1s text-to-speech latency. We chose speed over maximum quality because real-time coaching requires immediate response. The voice is natural enough to listen to continuously, optimized for streaming (not pre-generated), and doesn't lag gameplay.
```

### For Real-Time AI Systems

```
DuoAI achieves <2s end-to-end latency: screen capture → Claude vision analysis → knowledge base retrieval → advice generation → ElevenLabs TTS → audio playback. Serverless Python + Node.js on Vercel with optimized frame processing. Proves multi-step AI pipelines can run in real-time without dedicated infrastructure.
```

### For Educational / Coaching AI

```
DuoAI demonstrates context-aware coaching: it sees what the learner sees (screen), understands domain-specific knowledge (game rules), and provides spoken guidance (voice output). Hands-free interaction means learners don't pause to read—they keep practicing while receiving feedback. Applicable beyond gaming to any skill with visual context.
```

---

## Stack Mentions

**For technical depth:**
```
Python (17.0%) for AI workloads (generate_advice.py, video processing, knowledge base prep, Claude API integration). JavaScript (29.3%) for real-time frontend (voice input, API client, UI updates, ElevenLabs playback). HTML (35.4%) + CSS (18.3%) for overlay interface. Vercel serverless (Python + Node.js together) with CORS-configured API routes.
```

**For performance:**
```
<2s end-to-end latency (question → voice response), ElevenLabs eleven_turbo_v2_5 (sub-1s TTS), real-time screen capture (doesn't lag gameplay), optimized frame processing, serverless scaling.
```

---

## Evidence Sprint Examples

### Computer Vision Proof-of-Concept
```
We can build a working prototype that captures your app's UI, analyzes it with Claude vision API, and identifies key elements/states. Demo: live screen analysis with structured output (what it sees + confidence scores). 5-day delivery, $4,000.
```

### Voice-Interactive Coach
```
Proof-of-concept with domain-specific knowledge base that answers voice questions about [your subject] with spoken responses via ElevenLabs. Demo: hands-free Q&A with <3s response time, context retention across conversation. 7-day delivery, $5,000.
```

### Multi-Modal AI Interaction
```
Working prototype combining screen capture (what user sees), voice input (what user asks), and AI reasoning (contextual responses). Demo: all three modalities coordinated in real-time with visual + audio feedback. 10-day delivery, $6,500.
```

### Real-Time Feedback System
```
Proof-of-concept that monitors [your application], detects specific states/events, and provides real-time alerts or coaching via voice or UI overlay. Demo: <2s detection-to-feedback latency with configurable triggers. 7-day delivery, $5,500.
```

---

## When to Reference

**Strong signal in job post:**
- Keywords: computer vision, screen capture, OCR, image analysis, gaming AI, esports, coaching platform, voice AI, ElevenLabs, multi-modal, real-time feedback, educational AI
- Mentions: Claude vision API, speech-to-text, text-to-speech, hands-free interaction, contextual AI, AI assistant with vision
- Client persona: gaming startup, edtech platform, training/coaching SaaS, accessibility tools, productivity AI, real-time monitoring

**Weak signal (don't force):**
- Generic "AI chatbot" without vision/voice
- Batch processing (not real-time)
- Text-only interaction
- Pre-recorded content (not live feedback)
- Mobile-first (DuoAI is desktop screen capture)

---

## Links

- Live: https://duoai.vercel.app
- GitHub: https://github.com/mind-protocol/duoai
- Timeline: 2024-2025 (49 deployments)
- Stack: Python, JavaScript, HTML, CSS, Claude API, ElevenLabs
