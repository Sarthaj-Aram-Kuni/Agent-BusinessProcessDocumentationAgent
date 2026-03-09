# Process Documentation Agent

**AI-powered business process analysis that generates BPMN flowcharts, identifies bottlenecks, and suggests Lean improvements**

---

## Features

- **AI Process Analysis** — Describe any business process in plain English and get a full structured breakdown powered by Claude
- **BPMN Flowcharts** — Auto-generated Mermaid.js flowcharts with swim lanes, decision diamonds, and colour-coded node types (manual, automated, bottleneck)
- **Bottleneck Detection** — Identifies High / Medium / Low severity bottlenecks with risk descriptions and targeted recommendations
- **Lean Improvement Suggestions** — Each suggestion maps to a Lean principle (eliminate waste, reduce handoffs, automate, standardise) with concrete estimated gains
- **Process Metrics Dashboard** — Live metrics bar showing total steps, automation %, handoff count, and a calculated process health score (0–100)
- **Process Type Selector** — Pre-tunes the AI prompt for 7 standard enterprise process archetypes: Order-to-Cash, Procure-to-Pay, Hire-to-Retire, Record-to-Report, Issue-to-Resolution, Lead-to-Cash, Plan-to-Produce
- **Side-by-Side Comparison Mode** — Run two analyses in parallel and compare flowcharts, bottlenecks, and metrics
- **Analysis History** — Client-side history of past analyses with restore and delete, persisted in localStorage
- **Export to PDF** — One-click PDF export of the full analysis report via jsPDF
- **Export to Markdown** — Download analysis as a structured `.md` file for wikis or documentation tools

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI Model | Anthropic Claude (claude-sonnet-4-5) |
| Flowcharts | Mermaid.js |
| PDF Export | jsPDF |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sarthajkuni/Agent-BusinessProcessDocumentationAgent.git
cd Agent-BusinessProcessDocumentationAgent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

Get your API key from [console.anthropic.com](https://console.anthropic.com).

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
├── app/
│   ├── api/
│   │   └── analyse/
│   │       └── route.ts          # API route — calls Claude, validates & returns JSON
│   ├── compare/
│   │   └── page.tsx              # Side-by-side process comparison page
│   ├── components/
│   │   ├── AnalysisPanel.tsx     # Main results panel (tabs: flowchart, steps, bottlenecks, improvements)
│   │   ├── ExportButtons.tsx     # PDF and Markdown export controls
│   │   ├── HistoryPanel.tsx      # localStorage-backed analysis history sidebar
│   │   ├── LoadingSkeleton.tsx   # Animated placeholder shown during API call
│   │   ├── MermaidChart.tsx      # Mermaid.js renderer with error boundary
│   │   ├── MetricsBar.tsx        # Process health score and key metrics strip
│   │   ├── ProcessInput.tsx      # Textarea + process type selector + submit
│   │   ├── StepsTable.tsx        # Tabular view of parsed process steps
│   │   └── Toast.tsx             # Non-blocking notification system
│   ├── error.tsx                 # Next.js error boundary
│   ├── global-error.tsx          # Top-level error boundary
│   ├── globals.css               # Tailwind base styles
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Home page
├── lib/
│   ├── anthropic.ts              # Anthropic SDK client singleton
│   ├── exportMarkdown.ts         # Markdown serialiser for analysis results
│   ├── exportPdf.ts              # jsPDF-based PDF generator
│   └── prompts.ts                # BPMN expert system prompt + process-type context builder
├── .env.example                  # Example environment variables
├── next.config.ts                # Next.js config (security headers)
└── tsconfig.json
```

---

## How It Works

1. **User input** — The user types a free-text description of their business process and optionally selects a process archetype (e.g. Procure-to-Pay).

2. **System prompt injection** — `lib/prompts.ts` builds a system prompt that personas Claude as a *Senior Business Process Analyst with 15 years of BPMN and Lean Six Sigma experience*. If a process type is selected, domain-specific context is appended (common actors, typical bottlenecks, standard KPIs for that archetype).

3. **Claude API call** — `app/api/analyse/route.ts` sends the system prompt and user description to `claude-sonnet-4-5` via the Anthropic SDK. A 60-second timeout prevents hanging requests.

4. **Structured JSON response** — Claude returns a single JSON object (no markdown fences) with six top-level fields:

   | Field | Contents |
   |---|---|
   | `summary` | 2–3 sentence executive summary |
   | `steps` | Array of parsed steps with actor, action, system, type, and bottleneck flag |
   | `mermaidCode` | Valid Mermaid flowchart string with swim lanes and styled nodes |
   | `bottlenecks` | Severity-rated list with risk description and recommendation |
   | `improvements` | Lean-mapped improvement suggestions with estimated gains |
   | `metrics` | Step counts, automation %, handoff count, and health score |

5. **Rendering** — The response is validated on the server, then streamed to the client where `MermaidChart.tsx` renders the flowchart, `StepsTable.tsx` renders the steps, and `MetricsBar.tsx` displays the health score.

---

## Deployment

The app is designed for zero-config deployment on Vercel.

### Deploy to Vercel

1. Push your repository to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add the environment variable `ANTHROPIC_API_KEY` in the Vercel project settings
4. Deploy — Vercel handles the build and serverless API routes automatically

The `next.config.ts` file includes production security headers (CSP, X-Frame-Options, HSTS).

---

## Built By

**Sarthaj Aram Kuni**

Built as part of a portfolio of AI agent projects demonstrating practical Claude API usage, prompt engineering, and full-stack Next.js development.
