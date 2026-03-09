// app/components/StepsTable.tsx
// ──────────────────────────────────────────
// Displays process steps in a styled list
// ──────────────────────────────────────────

"use client";

interface Step {
  id: number;
  actor: string;
  action: string;
  system?: string;
  type: "manual" | "automated" | "decision";
  isBottleneck?: boolean;
  bottleneckReason?: string;
}

interface StepsTableProps {
  steps: Step[];
}

function typeStyles(type: string) {
  switch (type) {
    case "manual":
      return { bg: "bg-orange-900/30 text-orange-400 border-orange-800/40" };
    case "automated":
      return { bg: "bg-teal-900/30 text-teal-400 border-teal-800/40" };
    case "decision":
      return { bg: "bg-purple-900/30 text-purple-400 border-purple-800/40" };
    default:
      return { bg: "bg-gray-800 text-gray-400 border-gray-700" };
  }
}

export default function StepsTable({ steps }: StepsTableProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
      <h2 className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-4">
        Process Steps
      </h2>

      <div className="space-y-2">
        {steps.map((step, index) => {
          const styles = typeStyles(step.type);
          return (
            <div
              key={step.id || index}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                step.isBottleneck
                  ? "bg-red-950/20 border border-red-900/30"
                  : "bg-gray-950/40 hover:bg-gray-950/60"
              }`}
            >
              {/* Step number */}
              <span className="shrink-0 w-7 h-7 flex items-center justify-center bg-gray-800 text-gray-400 text-xs font-mono rounded-full mt-0.5">
                {step.id || index + 1}
              </span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 sm:gap-2">
                  <div className="min-w-0">
                    <span className="text-gray-500 text-sm">{step.actor}</span>
                    <p className="text-gray-200 text-sm mt-0.5">
                      {step.action}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {step.system && (
                      <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-400 rounded">
                        {step.system}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 text-xs rounded border ${styles.bg}`}
                    >
                      {step.type}
                    </span>
                  </div>
                </div>

                {/* Bottleneck warning */}
                {step.isBottleneck && step.bottleneckReason && (
                  <p className="text-red-400/80 text-xs mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    {step.bottleneckReason}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}