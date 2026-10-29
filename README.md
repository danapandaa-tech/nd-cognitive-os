# ND Cognitive OS

**A Personal AI for neurodivergent minds.** Built for the [Nebius x NVIDIA Global AI Hackathon](https://nebiusglobalaihackathon.devpost.com/) — **Personal AI track**.

## What it does

ND Cognitive OS tracks your cognitive state (flow, overwhelmed, scattered, hyperfocus, etc.), detects patterns over time, and generates **personalized insights** using NVIDIA Nemotron via Nebius Token Factory.

Core philosophy: **the logic is rule-based, local, and private.** AI is an optional enhancement layer that interprets anonymized pattern summaries — never raw personal data.

### Key Features

- **State Machine** — tracks 8 cognitive states with energy/sensory dimensions
- **Pattern Engine** — detects overwhelm loops, flow triggers, burnout precursors
- **Cognitive Map** — builds a longitudinal picture of how your mind works
- **SPARK Assessment** — profiles your cognitive style
- **Cognitive Insight** (Nemotron-powered) — explains your patterns in warm, plain language with one actionable suggestion

## How it uses NVIDIA + Nebius

| Component | Role |
|-----------|------|
| **NVIDIA Nemotron-3.5-Lightning** | Generates personalized cognitive insights from anonymized state data |
| **Nebius Token Factory** | Hosts and serves the Nemotron model via OpenAI-compatible API |
| **Persistent local memory** | State + patterns stored locally (Zustand + localStorage), never leaving the device |
| **On-demand AI calls** | Only calls Nemotron when user clicks "Generate Insight" — no background API usage |

### API Call Flow

```
User clicks "Generate Insight"
  → buildInsightContext() creates anonymized summary (state, patterns, energy)
  → POST /api/tokenfactory/chat/completions (Vite plugin or Vercel serverless)
  → Nebius Token Factory runs Nemotron-3.5-Lightning
  → Insight returned and displayed (thinking preamble stripped)
```

## Setup

```bash
# Clone
git clone <repo-url>
cd nd-cognitive-os

# Install
npm install

# Configure API key (get from https://tokenfactory.nebius.com)
echo "TOKEN_FACTORY_KEY=your_key_here" > .env

# Run dev server (port 3001)
npm run dev

# Build for production
npm run build

# Test
npm test
```

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `TOKEN_FACTORY_KEY` | Nebius Token Factory API key | Yes (for Insight feature) |

Without the key, all rule-based features work fine — only the AI Insight button is disabled.

## Tech Stack

- React 18 + Zustand 4 (state management)
- Vite 5 (build tooling)
- Tailwind CSS (styling)
- Vitest (testing)
- Nebius Token Factory / NVIDIA Nemotron-3.5-Lightning (AI insights)
- Deployed on Vercel (serverless function proxies API key)

## Hackathon Entry Details

- **Track**: Personal AI
- **Model**: NVIDIA Nemotron-3.5-Lightning via Nebius Token Factory
- **Privacy-first**: Only anonymized state summaries sent to AI. No PII, no raw data.
- **Always-on memory**: Cognitive state persists across sessions (localStorage + PostgreSQL via Hermes integration)
- **Reusable skills**: Rule-based engines (state machine, pattern detector) work without AI; Nemotron adds interpretation layer on top
- **User control**: All data local-first, AI is opt-in per-request

## License

MIT — see [LICENSE](LICENSE)
