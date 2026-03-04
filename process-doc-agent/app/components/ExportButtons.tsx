// app/components/ExportButtons.tsx
// ──────────────────────────────────────────────
// PDF, Markdown, and Copy JSON export options
// ──────────────────────────────────────────────

"use client";

interface ExportButtonsProps {
  onExportPdf: () => void;
  onExportMarkdown: () => void;
  onCopyJson: () => void;
  onCopyMermaid: () => void;
  loading?: boolean;
}

export default function ExportButtons({
  onExportPdf,
  onExportMarkdown,
  onCopyJson,
  onCopyMermaid,
  loading = false,
}: ExportButtonsProps) {
  return (
    <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Export
        </h2>
        <div className="flex flex-wrap gap-2">
          {/* PDF */}
          <button
            onClick={onExportPdf}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/40 rounded-md transition-colors disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>

          {/* Markdown */}
          <button
            onClick={onExportMarkdown}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-md transition-colors disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Markdown
          </button>

          {/* Copy Mermaid */}
          <button
            onClick={onCopyMermaid}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-purple-900/30 hover:bg-purple-900/50 text-purple-400 border border-purple-800/40 rounded-md transition-colors disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Mermaid
          </button>

          {/* Copy JSON */}
          <button
            onClick={onCopyJson}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-teal-900/30 hover:bg-teal-900/50 text-teal-400 border border-teal-800/40 rounded-md transition-colors disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            JSON
          </button>
        </div>
      </div>
    </div>
  );
}