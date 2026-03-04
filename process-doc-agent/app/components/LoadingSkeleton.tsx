// app/components/LoadingSkeleton.tsx
// ──────────────────────────────────────────────
// Animated skeleton placeholders while loading
// ──────────────────────────────────────────────

"use client";

export default function LoadingSkeleton() {
  return (
    <div className="mt-8 space-y-6 animate-fade-in">
      {/* Thinking indicator */}
      <div className="flex items-center gap-3 p-4 bg-teal-950/20 border border-teal-900/30 rounded-lg">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="text-teal-400 text-sm">
          Claude is analysing your process — mapping steps, identifying bottlenecks, generating flowchart...
        </p>
      </div>

      {/* Summary skeleton */}
      <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
        <div className="h-4 w-32 bg-gray-800 rounded animate-pulse mb-4" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-4/5 bg-gray-800 rounded animate-pulse" />
          <div className="h-3 w-3/5 bg-gray-800 rounded animate-pulse" />
        </div>
      </div>

      {/* Flowchart skeleton */}
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

      {/* Metrics skeleton */}
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