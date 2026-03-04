"use client";

import { useState, useMemo, useEffect, startTransition } from "react";

// Initialise mermaid only once per page load
let mermaidReady = false;

async function getMermaid() {
  const mermaid = (await import("mermaid")).default;
  if (!mermaidReady) {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      themeVariables: {
        darkMode: true,
        background: "#111827",
        primaryColor: "#0d9488",
        primaryTextColor: "#f3f4f6",
        primaryBorderColor: "#374151",
        lineColor: "#6b7280",
        secondaryColor: "#1f2937",
        tertiaryColor: "#1f2937",
      },
    });
    mermaidReady = true;
  }
  return mermaid;
}

export default function MermaidChart(props: { code: string }) {
  const [copyLabel, setCopyLabel] = useState("Copy Mermaid code");
  const [svg, setSvg] = useState<string | null>(null);
  const [renderFailed, setRenderFailed] = useState(false);

  const cleanCode = useMemo(function () {
    return props.code
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\t/g, "  ")
      .trim();
  }, [props.code]);

  const mermaidLiveUrl = useMemo(function () {
    try {
      const encoded = btoa(JSON.stringify({ code: cleanCode }));
      return "https://mermaid.live/edit#base64=" + encoded;
    } catch {
      return "https://mermaid.live";
    }
  }, [cleanCode]);

  useEffect(() => {
    let cancelled = false;
    startTransition(() => {
      setSvg(null);
      setRenderFailed(false);
    });

    getMermaid()
      .then((mermaid) =>
        mermaid.render(`mermaid-${Date.now()}`, cleanCode)
      )
      .then(({ svg: rendered }) => {
        if (!cancelled) setSvg(rendered);
      })
      .catch(() => {
        if (!cancelled) setRenderFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [cleanCode]);

  const handleCopy = async function () {
    try {
      await navigator.clipboard.writeText(cleanCode);
      setCopyLabel("Copied!");
      setTimeout(function () { setCopyLabel("Copy Mermaid code"); }, 2000);
    } catch {
      setCopyLabel("Failed");
      setTimeout(function () { setCopyLabel("Copy Mermaid code"); }, 2000);
    }
  };

  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-sm font-semibold text-teal-400 uppercase tracking-wider">
          Process Flowchart
        </h2>
        <div className="flex flex-wrap gap-1">
          <button
            onClick={handleCopy}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-gray-800"
          >
            {copyLabel}
          </button>
          <a
            href={mermaidLiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-teal-500 hover:text-teal-300 transition-colors px-2 py-1 rounded hover:bg-gray-800 whitespace-nowrap"
          >
            Open in Mermaid Live
          </a>
        </div>
      </div>

      {/* SVG diagram */}
      {svg && (
        <div
          className="overflow-x-auto [&>svg]:max-w-full [&>svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}

      {/* Loading state */}
      {!svg && !renderFailed && (
        <div className="flex items-center justify-center h-32 text-gray-500 text-sm animate-pulse">
          Rendering diagram…
        </div>
      )}

      {/* Raw code fallback on render failure — shown silently */}
      {renderFailed && (
        <pre className="text-sm text-gray-300 bg-gray-950/50 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
          {cleanCode}
        </pre>
      )}

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-teal-600 inline-block" />
          Automated
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />
          Bottleneck
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-purple-600 inline-block" />
          Decision
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-slate-600 inline-block" />
          Manual Step
        </span>
      </div>
    </div>
  );
}
