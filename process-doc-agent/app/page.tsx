// app/page.tsx
// ─────────────────────────────────────────────────
// Main page: text input → call API → display result
// This is the Day 1 test interface
// ─────────────────────────────────────────────────

"use client";

import { useState } from "react";

// ─── Type definitions ────────────────────────────
interface Step {
  id: number;
  actor: string;
  action: string;
  type: "manual" | "automated" | "decision";
}

interface Bottleneck {
  stepId: number;
  issue: string;
  severity: "High" | "Medium" | "Low";
}

interface Improvement {
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
}

interface AnalysisResult {
  summary: string;
  stepCount: number;
  steps: Step[];
  bottlenecks: Bottleneck[];
  improvements: Improvement[];
}

interface ErrorResponse {
  error: string;
  rawResponse?: string;
}

// ─── Severity badge colours ──────────────────────
function severityColour(severity: string): string {
  switch (severity) {
    case "High":
      return "bg-red-900/40 text-red-400 border border-red-800/50";
    case "Medium":
      return "bg-amber-900/40 text-amber-400 border border-amber-800/50";
    case "Low":
      return "bg-green-900/40 text-green-400 border border-green-800/50";
    default:
      return "bg-gray-800 text-gray-400";
  }
}

// ─── Step type badge colours ─────────────────────
function typeColour(type: string): string {
  switch (type) {
    case "manual":
      return "bg-orange-900/40 text-orange-400";
    case "automated":
      return "bg-teal-900/40 text-teal-400";
    case "decision":
      return "bg-purple-900/40 text-purple-400";
    default:
      return "bg-gray-800 text-gray-400";
  }
}

// ─── Example process descriptions ────────────────
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
    text: `A supplier sends an invoice by email. The accounts payable clerk downloads the PDF, manually enters the details into an Excel tracker, then checks if there's a matching purchase order in the ERP. If the amount is under £5,000 it goes to the department manager for approval via email. If over £5,000 it needs finance director sign-off, which requires printing the invoice and getting a physical signature. Once approved, the clerk creates a payment run in the banking portal.`,
  },
];

// ─── Main component ──────────────────────────────
export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ─── Submit handler ────────────────────────────
  const handleSubmit = async () => {
    // Don't submit if empty or already loading
    if (!input.trim() || loading) return;

    // Reset state
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Call our API route
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ processDescription: input }),
      });

      // Parse the response
      const data = await response.json();

      // Check for errors
      if (!response.ok) {
        const errData = data as ErrorResponse;
        throw new Error(errData.error || "API request failed");
      }

      // Success — set the result
      setResult(data as AnalysisResult);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Check your API key and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Load example into textarea ────────────────
  const loadExample = (text: string) => {
    setInput(text);
    setResult(null);
    setError("");
  };

  // ─── Render ────────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* ─── Header ─────────────────────── */}
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Process Documentation Agent
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Describe a business process in plain English. AI analyses it, finds
          bottlenecks, and suggests improvements.
        </p>

        {/* ─── Example buttons ────────────── */}
        <div className="mb-4">
          <span className="text-sm text-gray-500 mr-3">Try an example:</span>
          {EXAMPLES.map((example) => (
            <button
              key={example.label}
              onClick={() => loadExample(example.text)}
              className="mr-2 mb-2 px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
            >
              {example.label}
            </button>
          ))}
        </div>

        {/* ─── Text input ─────────────────── */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe a business process... e.g. 'When a customer places an order, the sales team checks inventory in a spreadsheet...'"
          rows={7}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none transition-colors"
        />

        {/* ─── Character count ────────────── */}
        <div className="flex justify-between items-center mt-2 mb-4">
          <span className="text-xs text-gray-600">
            {input.length} characters
            {input.length > 0 && input.length < 20 && (
              <span className="text-amber-500 ml-2">
                (minimum 20 characters)
              </span>
            )}
          </span>
          <button
            onClick={() => {
              setInput("");
              setResult(null);
              setError("");
            }}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
          >
            Clear
          </button>
        </div>

        {/* ─── Submit button ──────────────── */}
        <button
          onClick={handleSubmit}
          disabled={loading || input.trim().length < 20}
          className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
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
              Analysing with Claude...
            </span>
          ) : (
            "Analyse Process"
          )}
        </button>

        {/* ─── Error message ──────────────── */}
        {error && (
          <div className="mt-6 p-4 bg-red-950/50 border border-red-800 rounded-lg">
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* ─── Results ────────────────────── */}
        {result && (
          <div className="mt-8 space-y-6">

            {/* ─── Summary card ─────────── */}
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
              <h2 className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-3">
                Executive Summary
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {result.summary}
              </p>
              <div className="mt-4 flex gap-4">
                <span className="text-sm text-gray-500">
                  <span className="text-gray-300 font-medium">
                    {result.stepCount}
                  </span>{" "}
                  steps identified
                </span>
                <span className="text-sm text-gray-500">
                  <span className="text-red-400 font-medium">
                    {result.bottlenecks?.length || 0}
                  </span>{" "}
                  bottlenecks
                </span>
                <span className="text-sm text-gray-500">
                  <span className="text-teal-400 font-medium">
                    {result.improvements?.length || 0}
                  </span>{" "}
                  improvements
                </span>
              </div>
            </div>

            {/* ─── Process steps ─────────── */}
            {result.steps && result.steps.length > 0 && (
              <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
                <h2 className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-4">
                  Process Steps
                </h2>
                <div className="space-y-3">
                  {result.steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-start gap-3 p-3 bg-gray-950/50 rounded-md"
                    >
                      <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-gray-800 text-gray-400 text-xs font-mono rounded-full">
                        {step.id}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-200 text-sm">
                          <span className="text-gray-500">{step.actor}:</span>{" "}
                          {step.action}
                        </p>
                      </div>
                      <span
                        className={`flex-shrink-0 px-2 py-0.5 text-xs rounded-full ${typeColour(
                          step.type
                        )}`}
                      >
                        {step.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Bottlenecks ───────────── */}
            {result.bottlenecks && result.bottlenecks.length > 0 && (
              <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
                <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4">
                  Bottlenecks Identified
                </h2>
                <div className="space-y-3">
                  {result.bottlenecks.map((bottleneck, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-950/50 rounded-md"
                    >
                      <span className="flex-shrink-0 mt-0.5">
                        <svg
                          className="w-5 h-5 text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-200 text-sm">
                          {bottleneck.issue}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Step {bottleneck.stepId}
                        </p>
                      </div>
                      <span
                        className={`flex-shrink-0 px-2 py-0.5 text-xs rounded-full ${severityColour(
                          bottleneck.severity
                        )}`}
                      >
                        {bottleneck.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Improvements ──────────── */}
            {result.improvements && result.improvements.length > 0 && (
              <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
                <h2 className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-4">
                  Suggested Improvements
                </h2>
                <div className="space-y-3">
                  {result.improvements.map((improvement, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-950/50 rounded-md"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-gray-200 text-sm font-medium">
                          {improvement.title}
                        </p>
                        <span
                          className={`flex-shrink-0 px-2 py-0.5 text-xs rounded-full ${severityColour(
                            improvement.impact
                          )}`}
                        >
                          {improvement.impact} impact
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {improvement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Raw JSON toggle ────────── */}
            <details className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400">
                View raw JSON response
              </summary>
              <pre className="mt-3 text-xs text-gray-400 overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* ─── Footer / status ────────────── */}
        <div className="mt-12 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-600 text-center">
            Process Documentation Agent · Powered by Claude (Anthropic) ·
            Day 1 Test Interface
          </p>
        </div>
      </div>
    </main>
  );
}