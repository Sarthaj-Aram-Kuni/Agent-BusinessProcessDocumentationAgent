// app/page.tsx
// ──────────────────────────────────────────────
// Main page — Day 3: exports, retry, toasts
// ──────────────────────────────────────────────

"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import ProcessInput from "./components/ProcessInput";
import MetricsBar from "./components/MetricsBar";
import StepsTable from "./components/StepsTable";
import AnalysisPanel from "./components/AnalysisPanel";
import LoadingSkeleton from "./components/LoadingSkeleton";
import ExportButtons from "./components/ExportButtons";
import Toast from "./components/Toast";
import { generateMarkdown, downloadMarkdown } from "@/lib/exportMarkdown";
import { generatePdf } from "@/lib/exportPdf";
import MermaidChart from "./components/MermaidChart";
import HistoryPanel, { saveToHistory, HistoryEntry } from "./components/HistoryPanel";

// ─── Types ───────────────────────────────────
interface Step {
  id: number;
  actor: string;
  action: string;
  system?: string;
  type: "manual" | "automated" | "decision";
  isBottleneck?: boolean;
  bottleneckReason?: string;
}

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

interface AnalysisResult {
  summary: string;
  steps: Step[];
  mermaidCode: string;
  bottlenecks: Bottleneck[];
  improvements: Improvement[];
  metrics: {
    totalSteps: number;
    manualSteps: number;
    automatedSteps: number;
    decisionPoints: number;
    handoffs: number;
    bottleneckCount: number;
    automationPercentage: number;
    processHealthScore: number;
  };
  _meta?: {
    model: string;
    responseTimeMs: number;
    inputLength: number;
  };
}

// ─── Main Page ───────────────────────────────
export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastInput, setLastInput] = useState("");
  const [lastProcessType, setLastProcessType] = useState("general");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [slowWarning, setSlowWarning] = useState(false);
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Toast state
  const [toast, setToast] = useState({ message: "", visible: false, type: "success" as "success" | "error" | "info" });
  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, visible: true, type });
  }, []);

  // ─── Submit handler ────────────────────────
  const handleSubmit = async (processDescription: string, processType: string = "general") => {
    setLoading(true);
    setError("");
    setResult(null);
    setLastInput(processDescription);
    setLastProcessType(processType);
    setSlowWarning(false);
    slowTimerRef.current = setTimeout(() => setSlowWarning(true), 30_000);

    try {
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ processDescription, processType }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "API request failed");
      }

      const analysisResult = data as AnalysisResult;
      setResult(analysisResult);
      saveToHistory(processType, processDescription, analysisResult);
      setHistoryRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Check your API key and try again.");
      }
    } finally {
      setLoading(false);
      setSlowWarning(false);
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    }
  };

  // ─── History load handler ──────────────────
  const handleLoadHistory = useCallback((entry: HistoryEntry) => {
    setResult(entry.result as AnalysisResult);
    setLastInput(entry.label);
    setLastProcessType(entry.processType);
    setError("");
  }, []);

  // ─── Retry handler ─────────────────────────
  const handleRetry = () => {
    if (lastInput) {
      handleSubmit(lastInput, lastProcessType);
    }
  };

  // ─── Export handlers ───────────────────────
  const handleExportPdf = async () => {
    if (!result) return;
    try {
      await generatePdf(result);
      showToast("PDF downloaded successfully");
    } catch {
      showToast("Failed to generate PDF", "error");
    }
  };

  const handleExportMarkdown = () => {
    if (!result) return;
    try {
      const md = generateMarkdown(result, lastInput);
      downloadMarkdown(md);
      showToast("Markdown downloaded successfully");
    } catch {
      showToast("Failed to generate Markdown", "error");
    }
  };

  const handleCopyJson = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      showToast("JSON copied to clipboard");
    } catch {
      showToast("Failed to copy JSON", "error");
    }
  };

  const handleCopyMermaid = async () => {
    if (!result?.mermaidCode) return;
    try {
      const cleanCode = result.mermaidCode.replace(/\\n/g, "\n").replace(/\\"/g, '"');
      await navigator.clipboard.writeText(cleanCode);
      showToast("Mermaid code copied to clipboard");
    } catch {
      showToast("Failed to copy Mermaid code", "error");
    }
  };

  // ─── Render ────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-950">
      {/* ─── Header ───────────────────────── */}
      <header className="border-b border-gray-800/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-wrap items-start justify-between gap-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-100">
                Process Documentation Agent
              </h1>
              <p className="text-gray-500 mt-1.5 max-w-xl text-sm sm:text-base">
                Describe a business process in plain English. AI maps the steps,
                generates a BPMN flowchart, identifies bottlenecks, and suggests
                Lean improvements.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/compare"
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-800"
              >
                Compare Processes →
              </Link>
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-teal-950/40 border border-teal-900/40 rounded-full text-xs text-teal-400">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Powered by Claude
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Content ──────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Input */}
        <ProcessInput onSubmit={handleSubmit} loading={loading} />

        {/* History */}
        <HistoryPanel onLoad={handleLoadHistory} refreshKey={historyRefreshKey} />

        {/* Error with retry */}
        {error && (
          <div className="mt-6 p-4 bg-red-950/40 border border-red-800/50 rounded-lg animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-red-400 font-medium text-sm">Error</p>
                <p className="text-red-300/70 text-sm mt-1">{error}</p>
              </div>
              {lastInput && (
                <button
                  onClick={handleRetry}
                  disabled={loading}
                  className="shrink-0 ml-4 px-3 py-1.5 text-sm bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 rounded-md transition-colors"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading skeleton + slow-request advisory */}
        {loading && (
          <>
            {slowWarning && (
              <div className="mt-6 flex items-center gap-2 text-sm text-amber-400 animate-fade-in">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                This is taking longer than usual, please wait…
              </div>
            )}
            <LoadingSkeleton />
          </>
        )}

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-6 stagger-children">
            {/* Export buttons */}
            <div className="animate-slide-up">
              <ExportButtons
                onExportPdf={handleExportPdf}
                onExportMarkdown={handleExportMarkdown}
                onCopyJson={handleCopyJson}
                onCopyMermaid={handleCopyMermaid}
              />
            </div>

            {/* Summary */}
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg animate-slide-up">
              <h2 className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-3">
                Executive Summary
              </h2>
              <p className="text-gray-300 leading-relaxed">{result.summary}</p>
              {result._meta && (
                <p className="text-xs text-gray-600 mt-3">
                  Analysed in {(result._meta.responseTimeMs / 1000).toFixed(1)}s
                  using {result._meta.model}
                </p>
              )}
            </div>

            {/* Flowchart */}
            {result.mermaidCode && (
              <div className="animate-slide-up">
                <MermaidChart code={result.mermaidCode} />
              </div>
            )}

            {/* Metrics */}
            {result.metrics && (
              <div className="animate-slide-up">
                <MetricsBar metrics={result.metrics} />
              </div>
            )}

            {/* Steps */}
            {result.steps && result.steps.length > 0 && (
              <div className="animate-slide-up">
                <StepsTable steps={result.steps} />
              </div>
            )}

            {/* Bottlenecks + Improvements */}
            {(result.bottlenecks?.length > 0 || result.improvements?.length > 0) && (
              <div className="animate-slide-up">
                <AnalysisPanel
                  bottlenecks={result.bottlenecks || []}
                  improvements={result.improvements || []}
                />
              </div>
            )}

            {/* Raw JSON toggle */}
            <details className="p-4 bg-gray-900 border border-gray-800 rounded-lg animate-slide-up">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400">
                View raw JSON response
              </summary>
              <pre className="mt-3 text-xs text-gray-400 overflow-x-auto font-mono whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      {/* ─── Footer ───────────────────────── */}
      <footer className="border-t border-gray-800/40 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <p className="text-xs text-gray-600 text-center">
            Process Documentation Agent · Built by Sarthaj Aram Kuni ·
            Powered by Claude API + Next.js + Mermaid.js
          </p>
        </div>
      </footer>

      {/* ─── Toast ────────────────────────── */}
      <Toast
        message={toast.message}
        visible={toast.visible}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </main>
  );
}