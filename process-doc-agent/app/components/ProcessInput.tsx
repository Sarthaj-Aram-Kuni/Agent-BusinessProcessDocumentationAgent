// app/components/ProcessInput.tsx
// ─────────────────────────────────────────────
// Text input with process type selector and examples
// ─────────────────────────────────────────────

"use client";

import { useState } from "react";

// ─── Process types ───────────────────────────
const PROCESS_TYPES = [
  { value: "general", label: "General" },
  { value: "order-to-cash", label: "Order-to-Cash (O2C)" },
  { value: "procure-to-pay", label: "Procure-to-Pay (P2P)" },
  { value: "hire-to-retire", label: "Hire-to-Retire (H2R)" },
  { value: "record-to-report", label: "Record-to-Report (R2R)" },
  { value: "issue-to-resolution", label: "Issue-to-Resolution" },
  { value: "lead-to-cash", label: "Lead-to-Cash" },
  { value: "plan-to-produce", label: "Plan-to-Produce" },
];

// ─── Example process descriptions ────────────
const EXAMPLES = [
  {
    label: "Order-to-Cash",
    text: `When a customer places an order on our website, the sales team receives an email notification. They manually check inventory in a shared spreadsheet. If stock is available, they create a sales order in SAP. The warehouse team picks the items and updates the spreadsheet. Dispatch arranges a courier and sends tracking info to the customer by email. At month-end, finance manually reconciles orders against bank statements.`,
  },
  {
    label: "Employee Onboarding",
    text: `HR receives a signed offer letter by email. They manually create accounts in 4 different systems: Active Directory, Slack, Jira, and the payroll system. The hiring manager sends a welcome email with links to training materials stored in a shared drive. IT ships a laptop — they check a spreadsheet to see what is available. On day one, the new hire meets their buddy who walks them through a paper checklist of tasks to complete in the first week.`,
  },
  {
    label: "Invoice Approval",
    text: `A supplier sends an invoice by email. The accounts payable clerk downloads the PDF, manually enters the details into an Excel tracker, then checks if there is a matching purchase order in the ERP. If the amount is under 5000 pounds it goes to the department manager for approval via email. If over 5000 pounds it needs finance director sign-off, which requires printing the invoice and getting a physical signature. Once approved, the clerk creates a payment run in the banking portal.`,
  },
];

// ─── Props ────────────────────────────────────
interface ProcessInputProps {
  onSubmit: (description: string, processType: string) => void;
  loading: boolean;
}

export default function ProcessInput({ onSubmit, loading }: ProcessInputProps) {
  const [input, setInput] = useState("");
  const [processType, setProcessType] = useState("general");

  const handleSubmit = () => {
    if (!input.trim() || loading || input.trim().length < 20) return;
    onSubmit(input, processType);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div>
      {/* Top row: process type + examples */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        {/* Process type selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="processType" className="text-sm text-gray-500">
            Process type:
          </label>
          <select
            id="processType"
            value={processType}
            onChange={(e) => setProcessType(e.target.value)}
            disabled={loading}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal-500 disabled:opacity-50"
          >
            {PROCESS_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Example buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Try:</span>
          {EXAMPLES.map((example) => (
            <button
              key={example.label}
              onClick={() => setInput(example.text)}
              disabled={loading}
              className="px-2.5 py-1 text-xs bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-gray-200 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe a business process in plain English..."
        rows={6}
        disabled={loading}
        className="w-full bg-gray-900/80 border border-gray-700/80 rounded-xl p-5 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 resize-none transition-all disabled:opacity-60 leading-relaxed"
      />

      {/* Bottom bar */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-600">
            {input.length} characters
            {input.length > 0 && input.length < 20 && (
              <span className="text-amber-500 ml-2">(need at least 20)</span>
            )}
            {input.length >= 20 && input.length < 50 && (
              <span className="text-amber-500/80 ml-2">Short — more detail improves accuracy</span>
            )}
          </span>
          {input.length > 0 && (
            <button
              onClick={() => setInput("")}
              disabled={loading}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600 hidden sm:inline">
            Ctrl + Enter
          </span>
          <button
            onClick={handleSubmit}
            disabled={loading || input.trim().length < 20}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analysing...
              </span>
            ) : (
              "Analyse Process"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}