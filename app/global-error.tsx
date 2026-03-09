// app/global-error.tsx
// ──────────────────────────────────────────────
// Root-level error boundary — catches errors in
// the root layout itself. Must include <html>/<body>.
// ──────────────────────────────────────────────

"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 flex items-center justify-center px-4 font-sans antialiased">
        <div className="max-w-md w-full p-8 bg-gray-900 border border-red-900/30 rounded-xl text-center">
          <h2 className="text-lg font-semibold text-red-400 mb-2">
            Critical error
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {error.message || "The application encountered a critical error."}
          </p>
          <button
            onClick={reset}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
