// app/layout.tsx
// ──────────────────────────────────────
// Root layout with Google Fonts
// ──────────────────────────────────────

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// ─── Fonts ───────────────────────────────
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

// ─── Metadata ────────────────────────────
export const metadata: Metadata = {
  title: "Process Documentation Agent",
  description:
    "AI-powered business process analysis — generates BPMN flowcharts, identifies bottlenecks, and suggests Lean improvements.",
  openGraph: {
    title: "Process Documentation Agent",
    description: "Transform process descriptions into structured BPMN analysis with AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-gray-950 text-gray-100 antialiased font-[family-name:var(--font-sans)]">
        {children}
      </body>
    </html>
  );
}