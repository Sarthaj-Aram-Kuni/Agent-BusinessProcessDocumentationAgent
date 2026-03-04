// app/components/MetricsBar.tsx
// ──────────────────────────────────────────
// Quick stats cards showing process metrics
// ──────────────────────────────────────────

"use client";

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

interface MetricsBarProps {
  metrics: Metrics;
}

// ─── Health score colour ─────────────────────
function healthColour(score: number): string {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

function healthBg(score: number): string {
  if (score >= 70) return "bg-green-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}

export default function MetricsBar({ metrics }: MetricsBarProps) {
  const cards = [
    {
      label: "Total Steps",
      value: metrics.totalSteps,
      colour: "text-gray-100",
    },
    {
      label: "Manual",
      value: metrics.manualSteps,
      colour: "text-orange-400",
    },
    {
      label: "Automated",
      value: metrics.automatedSteps,
      colour: "text-teal-400",
    },
    {
      label: "Decisions",
      value: metrics.decisionPoints,
      colour: "text-purple-400",
    },
    {
      label: "Handoffs",
      value: metrics.handoffs,
      colour: "text-amber-400",
    },
    {
      label: "Bottlenecks",
      value: metrics.bottleneckCount,
      colour: "text-red-400",
    },
  ];

  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
      <h2 className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-4">
        Process Metrics
      </h2>

      {/* Stat cards grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-gray-950/60 rounded-lg p-3 text-center"
          >
            <p className={`text-2xl font-bold ${card.colour}`}>
              {card.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Health score and automation bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Process Health Score */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-500">Process Health</span>
            <span className={`text-sm font-bold ${healthColour(metrics.processHealthScore)}`}>
              {metrics.processHealthScore}/100
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${healthBg(metrics.processHealthScore)}`}
              style={{ width: `${metrics.processHealthScore}%` }}
            />
          </div>
        </div>

        {/* Automation Percentage */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-500">Automation Rate</span>
            <span className="text-sm font-bold text-teal-400">
              {metrics.automationPercentage}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-teal-500 transition-all duration-1000 ease-out"
              style={{ width: `${metrics.automationPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}