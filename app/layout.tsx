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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://process-doc-agent.vercel.app"
  ),
  title: "Process Documentation Agent",
  description:
    "AI-powered business process analysis that generates BPMN flowcharts, identifies bottlenecks, and suggests Lean improvements.",
  openGraph: {
    title: "Process Documentation Agent",
    description:
      "AI-powered business process analysis that generates BPMN flowcharts, identifies bottlenecks, and suggests Lean improvements.",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Process Documentation Agent — AI-powered BPMN analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Process Documentation Agent",
    description:
      "AI-powered business process analysis that generates BPMN flowcharts, identifies bottlenecks, and suggests Lean improvements.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
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