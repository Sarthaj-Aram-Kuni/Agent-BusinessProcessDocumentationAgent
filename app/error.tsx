// app/error.tsx
// ──────────────────────────────────────────────
// Route-level error boundary (Next.js App Router)
// Catches unhandled errors in page/layout rendering
// ──────────────────────────────────────────────

"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-gray-900 border border-gray-800 rounded-xl text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-950/50 border border-red-900/40 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-400"
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
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-100 mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            Go home
          </a>
        </div>

        {error.digest && (
          <p className="mt-4 text-xs text-gray-700 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
