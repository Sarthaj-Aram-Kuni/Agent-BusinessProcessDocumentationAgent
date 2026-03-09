// app/compare/page.tsx
// ──────────────────────────────────────────────────────
// Side-by-side As-Is vs To-Be process comparison page
// ──────────────────────────────────────────────────────

"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import MermaidChart from "@/app/components/MermaidChart";
import MetricsBar from "@/app/components/MetricsBar";
import Toast from "@/app/components/Toast";

// ─── Types (mirrored from page.tsx) ─────────────────
interface Bottleneck {
  stepId: number;
  title: string;
  severity: "High" | "Medium" | "Low";
  description: string;
  risk?: string;
  recommendation?: string;
}

interface Improvement {
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
  estimatedGain?: string;
  leanPrinciple?: string;
  enabler?: string;
}

interface Metrics {
  totalSteps: number;
  manualSteps: number;
  automatedSteps: number;
  decisionPoints: number;
  handoffs: number;
  bottleneckCount: number;
  automationPercentage: number;
  processHealthScore: number;
}

interface AnalysisResult {
  summary: string;
  mermaidCode: string;
  bottlenecks: Bottleneck[];
  improvements: Improvement[];
  metrics: Metrics;
}

// ─── Process type options ────────────────────────────
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

// ─── API helper ──────────────────────────────────────
async function analyseProcess(
  description: string,
  processType: string
): Promise<AnalysisResult> {
  const res = await fetch("/api/analyse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ processDescription: description, processType }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Analysis failed");
  return data as AnalysisResult;
}

// ─── Delta badge ─────────────────────────────────────
function DeltaBadge({
  from,
  to,
  lowerIsBetter = false,
  deltaUnit = "",
}: {
  from: number;
  to: number;
  lowerIsBetter?: boolean;
  deltaUnit?: string;
}) {
  const diff = to - from;
  if (diff === 0)
    return <span className="text-xs text-gray-600">no change</span>;
  const improved = lowerIsBetter ? diff < 0 : diff > 0;
  const sign = diff > 0 ? "+" : "";
  return (
    <span
      className={`text-xs font-semibold ${
        improved ? "text-green-400" : "text-red-400"
      }`}
    >
      {sign}
      {diff}
      {deltaUnit} {improved ? "↑" : "↓"}
    </span>
  );
}

// ─── Severity badge styles ───────────────────────────
function severityClass(severity: string) {
  switch (severity) {
    case "High":
      return "bg-red-900/30 text-red-400 border-red-800/40";
    case "Medium":
      return "bg-amber-900/30 text-amber-400 border-amber-800/40";
    default:
      return "bg-green-900/30 text-green-400 border-green-800/40";
  }
}

// ─── Comparison summary card ─────────────────────────
function ComparisonSummary({
  asIs,
  toBe,
}: {
  asIs: AnalysisResult;
  toBe: AnalysisResult;
}) {
  const a = asIs.metrics;
  const b = toBe.metrics;
  const healthDiff = b.processHealthScore - a.processHealthScore;

  const deltaRows = [
    {
      label: "Health Score",
      from: a.processHealthScore,
      to: b.processHealthScore,
      displayUnit: "/100",
      deltaUnit: " pts",
      lowerIsBetter: false,
    },
    {
      label: "Automation Rate",
      from: a.automationPercentage,
      to: b.automationPercentage,
      displayUnit: "%",
      deltaUnit: "%",
      lowerIsBetter: false,
    },
    {
      label: "Bottlenecks",
      from: a.bottleneckCount,
      to: b.bottleneckCount,
      displayUnit: "",
      deltaUnit: "",
      lowerIsBetter: true,
    },
    {
      label: "Manual Steps",
      from: a.manualSteps,
      to: b.manualSteps,
      displayUnit: "",
      deltaUnit: "",
      lowerIsBetter: true,
    },
    {
      label: "Handoffs",
      from: a.handoffs,
      to: b.handoffs,
      displayUnit: "",
      deltaUnit: "",
      lowerIsBetter: true,
    },
    {
      label: "Total Steps",
      from: a.totalSteps,
      to: b.totalSteps,
      displayUnit: "",
      deltaUnit: "",
      lowerIsBetter: false,
    },
  ];

  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-teal-400 uppercase tracking-wider">
          Comparison Summary
        </h2>
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full border ${
            healthDiff > 0
              ? "bg-green-900/30 text-green-400 border-green-800/40"
              : healthDiff < 0
              ? "bg-red-900/30 text-red-400 border-red-800/40"
              : "bg-gray-800 text-gray-400 border-gray-700"
          }`}
        >
          {healthDiff > 0
            ? `Health improved by ${healthDiff} pts`
            : healthDiff < 0
            ? `Health declined by ${Math.abs(healthDiff)} pts`
            : "No change in health score"}
        </span>
      </div>

      {/* Delta metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {deltaRows.map((row) => (
          <div
            key={row.label}
            className="bg-gray-950/60 rounded-lg p-3 text-center"
          >
            <p className="text-xs text-gray-500 mb-2">{row.label}</p>
            <p className="text-xs text-gray-300 font-mono">
              {row.from}
              {row.displayUnit} → {row.to}
              {row.displayUnit}
            </p>
            <div className="mt-1.5">
              <DeltaBadge
                from={row.from}
                to={row.to}
                lowerIsBetter={row.lowerIsBetter}
                deltaUnit={row.deltaUnit}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottleneck lists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            As-Is Bottlenecks
          </p>
          {asIs.bottlenecks?.length > 0 ? (
            <div className="space-y-1">
              {asIs.bottlenecks.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  <span className="text-gray-400 truncate">{b.title}</span>
                  <span
                    className={`flex-shrink-0 px-1.5 py-0.5 rounded text-xs ${
                      b.severity === "High"
                        ? "text-red-400"
                        : b.severity === "Medium"
                        ? "text-amber-400"
                        : "text-green-400"
                    }`}
                  >
                    {b.severity}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-600">None identified</p>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            To-Be Bottlenecks
          </p>
          {toBe.bottlenecks?.length > 0 ? (
            <div className="space-y-1">
              {toBe.bottlenecks.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-gray-400 truncate">{b.title}</span>
                  <span
                    className={`flex-shrink-0 px-1.5 py-0.5 rounded text-xs ${
                      b.severity === "High"
                        ? "text-red-400"
                        : b.severity === "Medium"
                        ? "text-amber-400"
                        : "text-green-400"
                    }`}
                  >
                    {b.severity}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-green-400">No bottlenecks remaining</p>
          )}
        </div>
      </div>

      {/* To-Be improvements */}
      {toBe.improvements?.length > 0 && (
        <div className="pt-4 mt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Improvements Applied in To-Be
          </p>
          <div className="flex flex-wrap gap-2">
            {toBe.improvements.map((imp, i) => (
              <span
                key={i}
                className={`text-xs px-2 py-1 rounded border ${severityClass(
                  imp.impact
                )}`}
              >
                {imp.impact} · {imp.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Bottleneck panel ────────────────────────────────
function BottleneckPanel({
  bottlenecks,
  variant,
}: {
  bottlenecks: Bottleneck[];
  variant: "as-is" | "to-be";
}) {
  const headingColour =
    variant === "as-is" ? "text-red-400" : "text-teal-400";
  const emptyMessage =
    variant === "to-be" ? (
      <p className="text-green-400 text-sm">
        No bottlenecks — process is optimised.
      </p>
    ) : (
      <p className="text-gray-500 text-sm">No bottlenecks identified.</p>
    );

  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
      <h2
        className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 ${headingColour}`}
      >
        <svg
          className="w-4 h-4"
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
        Bottlenecks ({bottlenecks?.length ?? 0})
      </h2>
      {bottlenecks?.length > 0 ? (
        <div className="space-y-2">
          {bottlenecks.map((b, i) => (
            <div
              key={i}
              className="flex items-start gap-2 p-3 bg-gray-950/40 rounded-lg"
            >
              <span
                className={`mt-0.5 flex-shrink-0 px-2 py-0.5 text-xs rounded border ${severityClass(
                  b.severity
                )}`}
              >
                {b.severity}
              </span>
              <div className="min-w-0">
                <p className="text-gray-200 text-sm">{b.title}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                  {b.description}
                </p>
                {b.recommendation && (
                  <p className="text-xs mt-1">
                    <span className="text-teal-400/70 font-medium">Fix: </span>
                    <span className="text-gray-500">{b.recommendation}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        emptyMessage
      )}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────
export default function ComparePage() {
  const [asIsInput, setAsIsInput] = useState("");
  const [toBeInput, setToBeInput] = useState("");
  const [asIsType, setAsIsType] = useState("general");
  const [toBeType, setToBeType] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [asIsResult, setAsIsResult] = useState<AnalysisResult | null>(null);
  const [toBeResult, setToBeResult] = useState<AnalysisResult | null>(null);
  const [toast, setToast] = useState({
    message: "",
    visible: false,
    type: "success" as "success" | "error" | "info",
  });

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      setToast({ message, visible: true, type });
    },
    []
  );

  const canSubmit =
    asIsInput.trim().length >= 20 &&
    toBeInput.trim().length >= 20 &&
    !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    setAsIsResult(null);
    setToBeResult(null);

    try {
      const [asIs, toBe] = await Promise.all([
        analyseProcess(asIsInput, asIsType),
        analyseProcess(toBeInput, toBeType),
      ]);
      setAsIsResult(asIs);
      setToBeResult(toBe);
      showToast("Both processes analysed", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Analysis failed";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950">
      {/* ─── Header ─────────────────────────────── */}
      <header className="border-b border-gray-800/60">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-100">
                Process Comparison
              </h1>
              <p className="text-gray-500 mt-1.5 max-w-xl">
                Paste an as-is and to-be process. Both are analysed
                simultaneously so you can see exactly what improved.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800"
              >
                ← Single Process
              </Link>
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-teal-950/40 border border-teal-900/40 rounded-full text-xs text-teal-400">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Powered by Claude
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Content ────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Input panel */}
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* As-Is */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <h3 className="text-sm font-semibold text-gray-200">
                    As-Is Process
                  </h3>
                  <span className="text-xs text-gray-600">current state</span>
                </div>
                <select
                  value={asIsType}
                  onChange={(e) => setAsIsType(e.target.value)}
                  disabled={loading}
                  className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-teal-500 disabled:opacity-50"
                >
                  {PROCESS_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={asIsInput}
                onChange={(e) => setAsIsInput(e.target.value)}
                placeholder="Describe the current (as-is) process in plain English..."
                rows={7}
                disabled={loading}
                className="w-full bg-gray-950/60 border border-gray-700/80 rounded-xl p-4 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 resize-none transition-all disabled:opacity-60 leading-relaxed text-sm"
              />
              <p className="text-xs text-gray-600 mt-1.5">
                {asIsInput.length} characters
                {asIsInput.length > 0 && asIsInput.trim().length < 20 && (
                  <span className="text-amber-500 ml-2">(need at least 20)</span>
                )}
              </p>
            </div>

            {/* To-Be */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  <h3 className="text-sm font-semibold text-gray-200">
                    To-Be Process
                  </h3>
                  <span className="text-xs text-gray-600">future state</span>
                </div>
                <select
                  value={toBeType}
                  onChange={(e) => setToBeType(e.target.value)}
                  disabled={loading}
                  className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-teal-500 disabled:opacity-50"
                >
                  {PROCESS_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={toBeInput}
                onChange={(e) => setToBeInput(e.target.value)}
                placeholder="Describe the improved (to-be) process in plain English..."
                rows={7}
                disabled={loading}
                className="w-full bg-gray-950/60 border border-gray-700/80 rounded-xl p-4 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 resize-none transition-all disabled:opacity-60 leading-relaxed text-sm"
              />
              <p className="text-xs text-gray-600 mt-1.5">
                {toBeInput.length} characters
                {toBeInput.length > 0 && toBeInput.trim().length < 20 && (
                  <span className="text-amber-500 ml-2">(need at least 20)</span>
                )}
              </p>
            </div>
          </div>

          {/* Submit row */}
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-800">
            <p className="text-xs text-gray-600">
              Both processes are sent to Claude simultaneously
            </p>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="px-8 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
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
                  Analysing both processes…
                </span>
              ) : (
                "Compare Processes"
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-950/40 border border-red-800/50 rounded-lg">
            <p className="text-red-400 font-medium text-sm">Error</p>
            <p className="text-red-300/70 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="mt-8 flex items-center gap-3 p-4 bg-teal-950/20 border border-teal-900/30 rounded-lg">
            <div className="flex gap-1">
              <span
                className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <p className="text-teal-400 text-sm">
              Analysing both processes simultaneously — mapping steps,
              identifying bottlenecks, generating flowcharts…
            </p>
          </div>
        )}

        {/* ─── Results ──────────────────────────── */}
        {asIsResult && toBeResult && (
          <div className="mt-8 space-y-6">
            {/* Comparison summary (full width) */}
            <ComparisonSummary asIs={asIsResult} toBe={toBeResult} />

            {/* Column labels */}
            <div className="grid grid-cols-2 gap-6 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="text-sm font-semibold text-gray-300">
                  As-Is Process
                </span>
                <span className="text-xs text-gray-600">current state</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                <span className="text-sm font-semibold text-gray-300">
                  To-Be Process
                </span>
                <span className="text-xs text-gray-600">future state</span>
              </div>
            </div>

            {/* Executive summaries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 bg-gray-900 border border-gray-800 border-l-2 border-l-red-800 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Executive Summary
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {asIsResult.summary}
                </p>
              </div>
              <div className="p-5 bg-gray-900 border border-gray-800 border-l-2 border-l-teal-700 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Executive Summary
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {toBeResult.summary}
                </p>
              </div>
            </div>

            {/* Flowcharts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MermaidChart code={asIsResult.mermaidCode} />
              <MermaidChart code={toBeResult.mermaidCode} />
            </div>

            {/* Metrics bars */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MetricsBar metrics={asIsResult.metrics} />
              <MetricsBar metrics={toBeResult.metrics} />
            </div>

            {/* Bottleneck panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BottleneckPanel
                bottlenecks={asIsResult.bottlenecks}
                variant="as-is"
              />
              <BottleneckPanel
                bottlenecks={toBeResult.bottlenecks}
                variant="to-be"
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── Footer ─────────────────────────────── */}
      <footer className="border-t border-gray-800/40 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-xs text-gray-600 text-center">
            Process Documentation Agent · Built by Sarthaj Aram Kuni · Powered
            by Claude API + Next.js + Mermaid.js
          </p>
        </div>
      </footer>

      <Toast
        message={toast.message}
        visible={toast.visible}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </main>
  );
}
