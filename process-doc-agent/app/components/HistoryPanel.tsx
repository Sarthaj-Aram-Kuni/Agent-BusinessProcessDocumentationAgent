// app/components/HistoryPanel.tsx
// ──────────────────────────────────────────────
// Collapsible history of past analyses (localStorage)
// ──────────────────────────────────────────────

"use client";

import { useState, useEffect, startTransition } from "react";

// ─── Types ───────────────────────────────────
export interface HistoryEntry {
  id: string;
  timestamp: number;
  processType: string;
  label: string;
  result: unknown;
}

interface HistoryPanelProps {
  onLoad: (entry: HistoryEntry) => void;
  // signal from parent to re-read storage after a new save
  refreshKey: number;
}

// ─── Constants ───────────────────────────────
const STORAGE_KEY = "process-doc-history";
const MAX_ENTRIES = 10;

const PROCESS_TYPE_LABELS: Record<string, string> = {
  general: "General",
  "order-to-cash": "O2C",
  "procure-to-pay": "P2P",
  "hire-to-retire": "H2R",
  "record-to-report": "R2R",
  "issue-to-resolution": "I2R",
  "lead-to-cash": "L2C",
  "plan-to-produce": "P2P+",
};

// ─── Storage helpers (exported for page.tsx) ─
export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(
  processType: string,
  inputText: string,
  result: unknown
): void {
  if (typeof window === "undefined") return;
  const history = loadHistory();
  const entry: HistoryEntry = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    processType,
    label: inputText.trim().slice(0, 50),
    result,
  };
  const updated = [entry, ...history].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Health score colour ──────────────────────
function healthColour(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

// ─── Relative time ────────────────────────────
function relativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// ─── Component ────────────────────────────────
export default function HistoryPanel({ onLoad, refreshKey }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [open, setOpen] = useState(false);

  // Reload from storage whenever parent signals a new save
  useEffect(() => {
    startTransition(() => setHistory(loadHistory()));
  }, [refreshKey]);

  if (history.length === 0) return null;

  const handleClear = () => {
    clearHistory();
    setHistory([]);
    setOpen(false);
  };

  return (
    <div className="mt-4 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      {/* ─── Toggle header ──────────────────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/40 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm text-gray-400 font-medium">
            Recent analyses
          </span>
          <span className="px-1.5 py-0.5 bg-gray-800 text-gray-500 text-xs rounded-full">
            {history.length}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ─── History list ───────────────────── */}
      {open && (
        <div className="border-t border-gray-800">
          {history.map((entry, i) => {
            const metrics = (entry.result as { metrics?: { processHealthScore?: number } })
              ?.metrics;
            const score = metrics?.processHealthScore ?? null;
            const typeLabel =
              PROCESS_TYPE_LABELS[entry.processType] ?? entry.processType;

            return (
              <button
                key={entry.id}
                onClick={() => onLoad(entry)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800/50 transition-colors ${
                  i < history.length - 1 ? "border-b border-gray-800/60" : ""
                }`}
              >
                {/* Process type badge */}
                <span className="flex-shrink-0 px-2 py-0.5 bg-teal-950/50 border border-teal-900/40 text-teal-400 text-xs rounded font-mono">
                  {typeLabel}
                </span>

                {/* Label */}
                <span className="flex-1 text-sm text-gray-300 truncate min-w-0">
                  {entry.label}
                  {entry.label.length === 50 ? "…" : ""}
                </span>

                {/* Health score */}
                {score !== null && (
                  <span
                    className={`flex-shrink-0 text-xs font-semibold tabular-nums ${healthColour(
                      score
                    )}`}
                  >
                    {score}/100
                  </span>
                )}

                {/* Timestamp */}
                <span className="flex-shrink-0 text-xs text-gray-600 w-16 text-right">
                  {relativeTime(entry.timestamp)}
                </span>
              </button>
            );
          })}

          {/* Clear button */}
          <div className="px-4 py-2.5 border-t border-gray-800/60 flex justify-end">
            <button
              onClick={handleClear}
              className="text-xs text-gray-600 hover:text-red-400 transition-colors"
            >
              Clear history
            </button>
          </div>
        </div>
      )}
    </div>
  );
}