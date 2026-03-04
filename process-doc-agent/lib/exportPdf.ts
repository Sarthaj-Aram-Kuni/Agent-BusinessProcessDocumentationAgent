// lib/exportPdf.ts
// ──────────────────────────────────────────────
// Generates a PDF report from the analysis
// Uses jsPDF for document creation
// ──────────────────────────────────────────────

import jsPDF from "jspdf";

interface Step {
  id: number;
  actor: string;
  action: string;
  system?: string;
  type: string;
  isBottleneck?: boolean;
  bottleneckReason?: string;
}

interface Bottleneck {
  stepId: number;
  title: string;
  severity: string;
  description: string;
  risk?: string;
  recommendation?: string;
}

interface Improvement {
  title: string;
  description: string;
  impact: string;
  estimatedGain?: string;
  leanPrinciple?: string;
  enabler?: string;
}

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

interface AnalysisResult {
  summary: string;
  steps: Step[];
  mermaidCode: string;
  bottlenecks: Bottleneck[];
  improvements: Improvement[];
  metrics: Metrics;
}

// ─── Colour helpers (RGB) ────────────────────
const COLOURS = {
  teal: [13, 148, 136] as [number, number, number],
  red: [239, 68, 68] as [number, number, number],
  amber: [245, 158, 11] as [number, number, number],
  green: [34, 197, 94] as [number, number, number],
  purple: [124, 58, 237] as [number, number, number],
  darkBg: [15, 23, 42] as [number, number, number],
  cardBg: [30, 41, 59] as [number, number, number],
  text: [226, 232, 240] as [number, number, number],
  textMuted: [148, 163, 184] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

function severityColour(severity: string): [number, number, number] {
  switch (severity) {
    case "High": return COLOURS.red;
    case "Medium": return COLOURS.amber;
    case "Low": return COLOURS.green;
    default: return COLOURS.textMuted;
  }
}

export async function generatePdf(analysis: AnalysisResult): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ─── Helper: check if we need a new page ──
  const checkNewPage = (requiredSpace: number) => {
    if (y + requiredSpace > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // ─── Helper: draw section heading ─────────
  const drawHeading = (text: string, colour: [number, number, number] = COLOURS.teal) => {
    checkNewPage(15);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colour);
    doc.text(text, margin, y);
    y += 3;
    doc.setDrawColor(...colour);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentWidth, y);
    y += 8;
  };

  // ─── Helper: draw body text ───────────────
  const drawText = (text: string, fontSize: number = 10) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLOURS.text);
    const lines = doc.splitTextToSize(text, contentWidth);
    for (const line of lines) {
      checkNewPage(6);
      doc.text(line, margin, y);
      y += 5;
    }
    y += 3;
  };

  // ─── Helper: draw label-value pair ────────
  const drawLabelValue = (label: string, value: string) => {
    checkNewPage(7);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLOURS.textMuted);
    doc.text(label, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLOURS.text);
    doc.text(value, margin + 45, y);
    y += 6;
  };

  // ═══════════════════════════════════════════
  // PAGE 1: Title + Summary + Metrics
  // ═══════════════════════════════════════════

  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLOURS.white);
  doc.text("Process Analysis Report", margin, y);
  y += 10;

  // Date and tool
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLOURS.textMuted);
  const now = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(`Generated: ${now}  |  Tool: Process Documentation Agent (Claude AI)`, margin, y);
  y += 12;

  // Summary
  drawHeading("Executive Summary");
  drawText(analysis.summary);
  y += 3;

  // Metrics table
  drawHeading("Process Metrics");

  const metricsData = [
    ["Total Steps", String(analysis.metrics.totalSteps)],
    ["Manual Steps", String(analysis.metrics.manualSteps)],
    ["Automated Steps", String(analysis.metrics.automatedSteps)],
    ["Decision Points", String(analysis.metrics.decisionPoints)],
    ["Handoffs", String(analysis.metrics.handoffs)],
    ["Bottlenecks", String(analysis.metrics.bottleneckCount)],
    ["Automation Rate", `${analysis.metrics.automationPercentage}%`],
    ["Health Score", `${analysis.metrics.processHealthScore}/100`],
  ];

  // Draw metrics in 2 columns
  const colWidth = contentWidth / 2;
  metricsData.forEach((row, i) => {
    const col = i % 2;
    if (col === 0 && i > 0) y += 6;
    if (col === 0) checkNewPage(8);

    const x = margin + col * colWidth;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLOURS.textMuted);
    doc.text(row[0] + ":", x, y);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLOURS.white);
    doc.text(row[1], x + 40, y);
  });
  y += 12;

  // ═══════════════════════════════════════════
  // PROCESS STEPS
  // ═══════════════════════════════════════════
  drawHeading("Process Steps");

  if (analysis.steps && analysis.steps.length > 0) {
    analysis.steps.forEach((step) => {
      checkNewPage(14);

      // Step number + actor
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...COLOURS.white);
      doc.text(`${step.id}.`, margin, y);

      doc.setTextColor(...COLOURS.textMuted);
      doc.text(step.actor, margin + 8, y);

      // Type badge
      const typeColour = step.type === "automated" ? COLOURS.teal
        : step.type === "decision" ? COLOURS.purple
        : COLOURS.amber;
      doc.setTextColor(...typeColour);
      doc.text(`[${step.type}]`, margin + contentWidth - 20, y);

      y += 5;

      // Action
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLOURS.text);
      const actionLines = doc.splitTextToSize(step.action, contentWidth - 10);
      actionLines.forEach((line: string) => {
        checkNewPage(5);
        doc.text(line, margin + 8, y);
        y += 4.5;
      });

      // Bottleneck warning
      if (step.isBottleneck && step.bottleneckReason) {
        doc.setFontSize(8);
        doc.setTextColor(...COLOURS.red);
        doc.text(`⚠ ${step.bottleneckReason}`, margin + 8, y);
        y += 5;
      }

      y += 3;
    });
  }

  // ═══════════════════════════════════════════
  // BOTTLENECKS
  // ═══════════════════════════════════════════
  if (analysis.bottlenecks && analysis.bottlenecks.length > 0) {
    drawHeading("Bottlenecks Identified", COLOURS.red);

    analysis.bottlenecks.forEach((b, i) => {
      checkNewPage(20);

      // Title with severity
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...severityColour(b.severity));
      doc.text(`[${b.severity}]`, margin, y);
      doc.setTextColor(...COLOURS.white);
      doc.text(`${i + 1}. ${b.title}`, margin + 18, y);
      y += 6;

      // Description
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLOURS.text);
      const descLines = doc.splitTextToSize(b.description, contentWidth - 5);
      descLines.forEach((line: string) => {
        checkNewPage(5);
        doc.text(line, margin + 5, y);
        y += 4.5;
      });

      if (b.risk) {
        checkNewPage(6);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...COLOURS.red);
        doc.text("Risk: ", margin + 5, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...COLOURS.text);
        doc.text(b.risk, margin + 18, y);
        y += 5;
      }

      if (b.recommendation) {
        checkNewPage(6);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...COLOURS.teal);
        doc.text("Fix: ", margin + 5, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...COLOURS.text);
        const recLines = doc.splitTextToSize(b.recommendation, contentWidth - 22);
        recLines.forEach((line: string) => {
          doc.text(line, margin + 16, y);
          y += 4.5;
        });
      }

      y += 5;
    });
  }

  // ═══════════════════════════════════════════
  // IMPROVEMENTS
  // ═══════════════════════════════════════════
  if (analysis.improvements && analysis.improvements.length > 0) {
    drawHeading("Recommended Improvements", COLOURS.teal);

    analysis.improvements.forEach((imp, i) => {
      checkNewPage(22);

      // Title with impact
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...severityColour(imp.impact));
      doc.text(`[${imp.impact}]`, margin, y);
      doc.setTextColor(...COLOURS.white);
      doc.text(`${i + 1}. ${imp.title}`, margin + 18, y);
      y += 6;

      // Description
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...COLOURS.text);
      const descLines = doc.splitTextToSize(imp.description, contentWidth - 5);
      descLines.forEach((line: string) => {
        checkNewPage(5);
        doc.text(line, margin + 5, y);
        y += 4.5;
      });

      if (imp.estimatedGain) {
        checkNewPage(6);
        drawLabelValue("Estimated Gain:", imp.estimatedGain);
      }
      if (imp.leanPrinciple) {
        checkNewPage(6);
        drawLabelValue("Lean Principle:", imp.leanPrinciple);
      }
      if (imp.enabler) {
        checkNewPage(6);
        drawLabelValue("Enabler:", imp.enabler);
      }

      y += 4;
    });
  }

  // ═══════════════════════════════════════════
  // MERMAID CODE (text version)
  // ═══════════════════════════════════════════
  if (analysis.mermaidCode) {
    drawHeading("Flowchart Code (Mermaid)");
    doc.setFontSize(7);
    doc.setFont("courier", "normal");
    doc.setTextColor(...COLOURS.textMuted);

    const cleanCode = analysis.mermaidCode
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"');

    const codeLines = cleanCode.split("\n");
    codeLines.forEach((line) => {
      checkNewPage(4);
      doc.text(line, margin + 2, y);
      y += 3.5;
    });
    y += 5;
  }

  // ═══════════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════════
  checkNewPage(15);
  y += 5;
  doc.setDrawColor(...COLOURS.textMuted);
  doc.setLineWidth(0.2);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;
  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(...COLOURS.textMuted);
  doc.text(
    "Generated by Process Documentation Agent — powered by Claude AI, Next.js, and Mermaid.js",
    margin,
    y
  );

  // ─── Save ──────────────────────────────────
  doc.save(`process-analysis-${Date.now()}.pdf`);
}