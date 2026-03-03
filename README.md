#  Business Process Documentation Agent

## Background
Following are Small and medium business facing issues because of a operational manager
- Lack of formalized/documented processes
- Lack of scenario and real time analysis
- Manual, repetitive, time-consuming tasks
- Resource/expertise constraints & resistance to change
- Poor visibility, bottlenecks, and scalability issues

# MVP V1

### Project Scope & Build Plan
---

## The Idea

A web app where users describe a business process in plain English (or paste messy notes), and an AI agent powered by Claude:

1. **Generates a structured BPMN-style flowchart** (rendered as a Mermaid diagram)
2. **Identifies bottlenecks, redundancies, and risks** in the process
3. **Suggests Lean/Six Sigma improvements** with estimated impact
4. **Exports clean documentation** (Markdown or PDF) ready for stakeholder review

This is essentially what a Business Analyst does manually — but automated as an intelligent assistant.

---

## Architecture Overview

```
User Input (plain English)
        │
        ▼
  Next.js Frontend (React)
        │
        ▼
  /api/analyse  (Next.js API Route)
        │
        ▼
  Anthropic Claude API
  (System prompt with BPMN + Lean expertise)
        │
        ▼
  Structured JSON Response
  ├── mermaidCode (flowchart string)
  ├── steps[] (process steps with details)
  ├── bottlenecks[] (identified issues)
  ├── improvements[] (Lean suggestions)
  └── summary (executive overview)
        │
        ▼
  Frontend renders:
  ├── Mermaid flowchart
  ├── Process analysis panel
  ├── Improvement suggestions
  └── Export to PDF / Markdown
```

---

## Core Features (MVP)

### Feature 1: Process Input
- Large text area where user describes a process in plain English
- Example placeholder: "When a customer places an order, the sales team checks inventory manually in a spreadsheet. If stock is available, they email the warehouse team. The warehouse picks and packs the order, then emails dispatch. Dispatch arranges a courier and updates the sales spreadsheet..."
- Optional: dropdown to select process type (Order-to-Cash, Procure-to-Pay, Hire-to-Retire, etc.)

### Feature 2: AI-Powered Analysis
- Claude receives the input with a carefully engineered system prompt
- Returns structured JSON containing:
  - Process steps (actor, action, system, decision points)
  - Mermaid.js flowchart code
  - Bottleneck identification with severity ratings
  - Lean improvement suggestions with estimated efficiency gains
  - Risk flags (manual handoffs, single points of failure, no validation)

### Feature 3: Visual Flowchart
- Mermaid.js renders the flowchart in real-time
- Colour-coded nodes: green (automated), amber (semi-manual), red (bottleneck)
- Decision diamonds, swim lanes where appropriate

### Feature 4: Analysis Dashboard
- Cards showing: total steps, manual vs automated ratio, bottleneck count
- Each bottleneck expandable with explanation and fix
- Each improvement suggestion with estimated impact (Low / Medium / High)

### Feature 5: Export
- Download as PDF (flowchart + analysis)
- Download as Markdown (for pasting into Confluence, Notion, etc.)
- Copy Mermaid code (for embedding elsewhere)

---

## System Prompt (The Secret Sauce)

This is where your BA expertise shines. The system prompt should encode your domain knowledge:

```
You are an expert Business Process Analyst with deep knowledge of BPMN 2.0 
notation, Lean Six Sigma methodology, and enterprise process transformation.

When given a business process description, you must:

1. PARSE the process into discrete steps, identifying:
   - Actors (who performs each step)
   - Actions (what is done)
   - Systems (what tools/software are used, if mentioned)
   - Decision points (where the flow branches)
   - Handoffs (where work passes between people/teams)

2. GENERATE a Mermaid.js flowchart using this syntax:
   - Use `flowchart TD` (top-down) or `flowchart LR` (left-right)
   - Use rectangles for tasks, diamonds for decisions
   - Use subgraphs for swim lanes (one per actor/department)
   - Colour-code: style bottleneck nodes with fill:#ff6b6b
   - Keep node labels concise (max 6 words)

3. IDENTIFY bottlenecks and risks:
   - Manual data entry or spreadsheet reliance
   - Email-based handoffs (no audit trail)
   - Single points of failure
   - Missing validation or approval steps
   - Redundant or duplicate steps
   - Rate each: High / Medium / Low severity

4. SUGGEST improvements using Lean principles:
   - Eliminate waste (muda): overprocessing, waiting, defects
   - Automate where possible
   - Reduce handoffs
   - Add validation gates
   - Estimate impact: efficiency gain %, error reduction %, time saved

5. RETURN your response as valid JSON with this exact structure:
{
  "summary": "Executive overview (2-3 sentences)",
  "steps": [
    {
      "id": 1,
      "actor": "Sales Team",
      "action": "Check inventory in spreadsheet",
      "system": "Excel",
      "type": "manual|automated|decision",
      "isBottleneck": true,
      "bottleneckReason": "Manual lookup prone to errors"
    }
  ],
  "mermaidCode": "flowchart TD\n  A[...] --> B[...]...",
  "bottlenecks": [
    {
      "step_id": 1,
      "title": "Manual inventory check",
      "severity": "High",
      "description": "...",
      "recommendation": "..."
    }
  ],
  "improvements": [
    {
      "title": "Automate inventory lookup",
      "description": "...",
      "impact": "High",
      "estimatedGain": "Reduce check time from 15 min to instant",
      "leanPrinciple": "Eliminate waiting waste"
    }
  ],
  "metrics": {
    "totalSteps": 8,
    "manualSteps": 5,
    "automatedSteps": 3,
    "decisionPoints": 2,
    "handoffs": 4,
    "bottleneckCount": 3
  }
}

Return ONLY valid JSON. No markdown fences. No preamble.
```

---

## Project Structure

```
process-doc-agent/
├── app/
│   ├── layout.tsx           # Root layout with fonts + metadata
│   ├── page.tsx             # Main app page
│   ├── api/
│   │   └── analyse/
│   │       └── route.ts     # API route calling Claude
│   └── components/
│       ├── ProcessInput.tsx  # Text area + submit
│       ├── FlowChart.tsx     # Mermaid renderer
│       ├── AnalysisPanel.tsx  # Bottlenecks + improvements
│       ├── MetricsBar.tsx    # Quick stats cards
│       └── ExportButton.tsx  # PDF/MD download
├── lib/
│   └── anthropic.ts         # Claude client setup
├── public/
│   └── og-image.png         # Social preview image
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## Build Timeline (Suggested)

| Phase | What to build | Time |
|---|---|---|
| 1. Setup | Next.js project, Tailwind, Anthropic SDK, env vars | Day 1 |
| 2. API Route | System prompt, Claude integration, JSON parsing | Day 1-2 |
| 3. Input UI | Process description textarea, example prompts, submit flow | Day 2 |
| 4. Flowchart | Mermaid.js integration, rendering, colour-coding | Day 3 |
| 5. Analysis Panel | Bottlenecks, improvements, metrics cards | Day 3-4 |
| 6. Export | PDF and Markdown download | Day 4 |
| 7. Polish | Loading states, error handling, responsive design, dark mode | Day 5 |
| 8. Deploy & Document | Vercel deploy, README, portfolio write-up | Day 5 |

**Total: ~5 days of focused work**

---

## Example Test Cases

Use these to demo and test your app:

### Test 1: Order-to-Cash (Simple)
"When a customer places an order on our website, the sales team receives an email notification. They manually check inventory in a shared spreadsheet. If stock is available, they create a sales order in SAP. The warehouse team picks the items and updates the spreadsheet. Dispatch arranges a courier and sends tracking info to the customer by email."

### Test 2: Employee Onboarding (Medium)
"HR receives a signed offer letter by email. They manually create accounts in 4 different systems: Active Directory, Slack, Jira, and the payroll system. The hiring manager then sends a welcome email with links to training materials stored in a shared drive. IT ships a laptop — they check a spreadsheet to see what's available. On day one, the new hire meets their buddy who walks them through a paper checklist of tasks to complete in the first week."

### Test 3: Invoice Approval (Complex)
"A supplier sends an invoice by email. The accounts payable clerk downloads the PDF, manually enters the details into an Excel tracker, then checks if there's a matching purchase order in the ERP. If the amount is under £5,000 it goes to the department manager for approval via email. If over £5,000 it needs finance director sign-off, which requires printing the invoice and getting a physical signature. Once approved, the clerk creates a payment run in the banking portal. Reconciliation is done manually at month-end by comparing the Excel tracker with the bank statement."


---

## Stretch Goals (Post-MVP)

Once the core works, these additions would make it even more impressive:

1. **Process Comparison Mode** — paste an "as-is" and "to-be" process, Claude generates both flowcharts side-by-side with a gap analysis
2. **Upload Support** — drag-and-drop a Word doc or PDF of existing process documentation, Claude extracts and analyses it
3. **Conversation Mode** — Claude asks clarifying questions about the process before generating (multi-turn)
4. **Template Library** — pre-loaded common processes (Order-to-Cash, Procure-to-Pay, Hire-to-Retire) as starting points
5. **Cost Estimation** — Claude estimates time/cost savings from each improvement suggestion
6. **Version History** — save and compare iterations of the same process over time