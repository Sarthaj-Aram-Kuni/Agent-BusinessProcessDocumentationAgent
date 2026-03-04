// app/components/AnalysisPanel.tsx
// ──────────────────────────────────────────────
// Bottlenecks and Improvement recommendations
// ──────────────────────────────────────────────

"use client";

import { useState } from "react";

// ─── Types ───────────────────────────────────
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

interface AnalysisPanelProps {
  bottlenecks: Bottleneck[];
  improvements: Improvement[];
}

// ─── Severity styles ─────────────────────────
function severityStyles(severity: string) {
  switch (severity) {
    case "High":
      return "bg-red-900/30 text-red-400 border-red-800/40";
    case "Medium":
      return "bg-amber-900/30 text-amber-400 border-amber-800/40";
    case "Low":
      return "bg-green-900/30 text-green-400 border-green-800/40";
    default:
      return "bg-gray-800 text-gray-400 border-gray-700";
  }
}

export default function AnalysisPanel({ bottlenecks, improvements }: AnalysisPanelProps) {
  const [expandedBottleneck, setExpandedBottleneck] = useState<number | null>(null);
  const [expandedImprovement, setExpandedImprovement] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ─── Bottlenecks ─────────────────────── */}
      <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
        <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Bottlenecks ({bottlenecks?.length || 0})
        </h2>

        <div className="space-y-2">
          {bottlenecks?.map((bottleneck, index) => (
            <div key={index} className="bg-gray-950/40 rounded-lg overflow-hidden">
              {/* Header — clickable */}
              <button
                onClick={() =>
                  setExpandedBottleneck(
                    expandedBottleneck === index ? null : index
                  )
                }
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-950/60 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`flex-shrink-0 px-2 py-0.5 text-xs rounded border ${severityStyles(bottleneck.severity)}`}>
                    {bottleneck.severity}
                  </span>
                  <span className="text-gray-200 text-sm truncate">
                    {bottleneck.title}
                  </span>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ml-2 ${
                    expandedBottleneck === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded details */}
              {expandedBottleneck === index && (
                <div className="px-3 pb-3 space-y-2">
                  <p className="text-gray-400 text-sm">{bottleneck.description}</p>
                  {bottleneck.risk && (
                    <p className="text-sm">
                      <span className="text-red-400/70 font-medium">Risk: </span>
                      <span className="text-gray-400">{bottleneck.risk}</span>
                    </p>
                  )}
                  {bottleneck.recommendation && (
                    <p className="text-sm">
                      <span className="text-teal-400/70 font-medium">Fix: </span>
                      <span className="text-gray-400">{bottleneck.recommendation}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-600">Step {bottleneck.stepId}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Improvements ────────────────────── */}
      <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
        <h2 className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Improvements ({improvements?.length || 0})
        </h2>

        <div className="space-y-2">
          {improvements?.map((improvement, index) => (
            <div key={index} className="bg-gray-950/40 rounded-lg overflow-hidden">
              {/* Header — clickable */}
              <button
                onClick={() =>
                  setExpandedImprovement(
                    expandedImprovement === index ? null : index
                  )
                }
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-950/60 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`flex-shrink-0 px-2 py-0.5 text-xs rounded border ${severityStyles(improvement.impact)}`}>
                    {improvement.impact}
                  </span>
                  <span className="text-gray-200 text-sm truncate">
                    {improvement.title}
                  </span>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ml-2 ${
                    expandedImprovement === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded details */}
              {expandedImprovement === index && (
                <div className="px-3 pb-3 space-y-2">
                  <p className="text-gray-400 text-sm">{improvement.description}</p>
                  {improvement.estimatedGain && (
                    <p className="text-sm">
                      <span className="text-teal-400/70 font-medium">Estimated gain: </span>
                      <span className="text-gray-400">{improvement.estimatedGain}</span>
                    </p>
                  )}
                  {improvement.leanPrinciple && (
                    <p className="text-sm">
                      <span className="text-purple-400/70 font-medium">Lean principle: </span>
                      <span className="text-gray-400">{improvement.leanPrinciple}</span>
                    </p>
                  )}
                  {improvement.enabler && (
                    <p className="text-sm">
                      <span className="text-gray-500 font-medium">Enabler: </span>
                      <span className="text-gray-400">{improvement.enabler}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}