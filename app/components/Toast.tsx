// app/components/Toast.tsx
// ──────────────────────────────────────────────
// Simple toast notification for copy/export feedback
// ──────────────────────────────────────────────

"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  type?: "success" | "error" | "info";
  duration?: number;
}

export default function Toast({
  message,
  visible,
  onClose,
  type = "success",
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose, duration]);

  if (!visible) return null;

  const bgColour = {
    success: "bg-teal-900/90 border-teal-700/50 text-teal-200",
    error: "bg-red-900/90 border-red-700/50 text-red-200",
    info: "bg-gray-800/90 border-gray-700/50 text-gray-200",
  }[type];

  const icon = {
    success: (
      <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }[type];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-fade-in max-w-xs sm:max-w-sm">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg ${bgColour}`}>
        {icon}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}