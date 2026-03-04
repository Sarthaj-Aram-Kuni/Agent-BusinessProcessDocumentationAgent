// app/components/LoadingSkeleton.tsx
// ──────────────────────────────────────────────
// Streaming status messages + skeleton placeholders
// ──────────────────────────────────────────────

"use client";

import { useState, useEffect } from "react";

// ─── Status steps ────────────────────────────
const STEPS = [
  "Parsing process steps...",
  "Generating flowchart...",
  "Identifying bottlenecks...",
  "Calculating metrics...",
];

const STEP_DELAY_MS = 2500;

// ─── Checkmark icon ──────────────────────────
function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-teal-500 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ─── Spinner dots ────────────────────────────
function SpinnerDots() {
  return (
    <span className="flex gap-1 shrink-0">
      <span
        className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </span>
  );
}

// ─── Component ───────────────────────────────
export default function LoadingSkeleton() {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    if (visibleCount >= STEPS.length) return;
    const timer = setTimeout(
      () => setVisibleCount((n) => n + 1),
      STEP_DELAY_MS
    );
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <div className="mt-8 space-y-6 animate-fade-in">
      {/* ─── Status panel ───────────────────── */}
      <div className="p-5 bg-teal-950/20 border border-teal-900/30 rounded-lg space-y-3">
        {STEPS.slice(0, visibleCount).map((step, i) => {
          const isDone = i < visibleCount - 1;
          const isCurrent = i === visibleCount - 1;

          return (
            <div
              key={step}
              className="flex items-center gap-3 animate-fade-in"
            >
              {isDone ? (
                <CheckIcon />
              ) : isCurrent ? (
                <SpinnerDots />
              ) : null}

              <span
                className={`text-sm transition-colors ${
                  isDone
                    ? "text-teal-700 line-through"
                    : "text-teal-300 font-medium"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* ─── Summary skeleton ───────────────── */}
      <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
        <div className="h-4 w-32 bg-gray-800 rounded animate-pulse mb-4" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-4/5 bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-3/5 bg-gray-800 rounded animate-pulse" />
        </div>
      </div>

      {/* ─── Flowchart skeleton ─────────────── */}
      <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
        <div className="h-4 w-40 bg-gray-800 rounded animate-pulse mb-4" />
        <div className="h-48 w-full bg-gray-950/50 rounded-lg flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-8 bg-gray-800 rounded animate-pulse" />
            <div className="w-0.5 h-6 bg-gray-800 animate-pulse" />
            <div className="w-28 h-8 bg-gray-800 rounded animate-pulse" />
            <div className="w-0.5 h-6 bg-gray-800 animate-pulse" />
            <div className="w-20 h-8 bg-gray-800 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* ─── Metrics skeleton ───────────────── */}
      <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
        <div className="h-4 w-36 bg-gray-800 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-950/60 rounded-lg p-3 text-center">
              <div className="h-7 w-8 bg-gray-800 rounded animate-pulse mx-auto mb-1" />
              <div className="h-3 w-14 bg-gray-800 rounded animate-pulse mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}