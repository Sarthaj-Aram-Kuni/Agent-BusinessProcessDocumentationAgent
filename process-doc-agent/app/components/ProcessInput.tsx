// app/components/ProcessInput.tsx
// ─────────────────────────────────────────────
// Text input with example buttons and submit
// ─────────────────────────────────────────────

"use client";

import { useState } from "react";

// ─── Example process descriptions ────────────
const EXAMPLES = [
  {
    label: "Order-to-Cash",
    text: `When a customer places an order on our website, the sales team receives an email notification. They manually check inventory in a shared spreadsheet. If stock is available, they create a sales order in SAP. The warehouse team picks the items and updates the spreadsheet. Dispatch arranges a courier and sends tracking info to the customer by email. At month-end, finance manually reconciles orders against bank statements.`,
  },
  {
    label: "Employee Onboarding",
    text: `HR receives a signed offer letter by email. They manually create accounts in 4 different systems: Active Directory, Slack, Jira, and the payroll system. The hiring manager sends a welcome email with links to training materials stored in a shared drive. IT ships a laptop — they check a spreadsheet to see what's available. On day one, the new hire meets their buddy who walks them through a paper checklist of tasks to complete in the first week.`,
  },
  {
    label: "Invoice Approval",
    text: `A supplier sends an invoice by email. The accounts payable clerk downloads the PDF, manually enters the details into an Excel tracker, then checks if there is a matching purchase order in the ERP. If the amount is under 5000 pounds it goes to the department manager for approval via email. If over 5000 pounds it needs finance director sign-off, which requires printing the invoice and getting a physical signature. Once approved, the clerk creates a payment run in the banking portal.`,
  },
];

// ─── Props ────────────────────────────────────
interface ProcessInputProps {
  onSubmit: (description: string) => void;
  loading: boolean;
}

export default function ProcessInput({ onSubmit, loading }: ProcessInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim() || loading || input.trim().length < 20) return;
    onSubmit(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSubmit();
    }
  };

  const loadExample = (text: string) => {
    setInput(text);
  };

  return (
    <div>
      {/* Example buttons */}
      <div className="mb-4">
        <span className="text-sm text-gray-500 mr-3">Try an example:</span>
        {EXAMPLES.map((example) => (
          <button
            key={example.label}
            onClick={() => loadExample(example.text)}
            disabled={loading}
            className="mr-2 mb-2 px-3 py-1.5 text-sm bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-gray-200 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {example.label}
          </button>
        ))}
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

      {/* Bottom bar: char count + submit */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-600">
            {input.length} characters
            {input.length > 0 && input.length < 20 && (
              <span className="text-amber-500 ml-2">
                (need at least 20)
              </span>
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
            Ctrl + Enter to submit
          </span>
          <button
            onClick={handleSubmit}
            disabled={loading || input.trim().length < 20}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
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