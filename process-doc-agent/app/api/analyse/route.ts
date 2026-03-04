// app/api/analyse/route.ts
// ─────────────────────────────────────────────────────────
// POST /api/analyse
// Receives a process description, sends it to Claude with
// the full BPMN system prompt, returns structured analysis
// ─────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import { SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(request: NextRequest) {
  // ──────────────────────────────────────
  // 1. Read and validate request body
  // ──────────────────────────────────────
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }

  const { processDescription } = body;

  if (!processDescription || typeof processDescription !== "string") {
    return NextResponse.json(
      { error: "processDescription is required and must be a string" },
      { status: 400 }
    );
  }

  if (processDescription.trim().length < 20) {
    return NextResponse.json(
      { error: "Please provide a more detailed process description (at least 20 characters)" },
      { status: 400 }
    );
  }

  // ──────────────────────────────────────
  // 2. Call Claude with full BPMN prompt
  // ──────────────────────────────────────
  try {
    console.log("Sending request to Claude...");
    const startTime = Date.now();

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 8096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyse the following business process and return your full JSON analysis:\n\n${processDescription}`,
        },
      ],
    });

    const elapsed = Date.now() - startTime;
    console.log(`Claude responded in ${elapsed}ms`);

    // ──────────────────────────────────────
    // 3. Extract text response
    // ──────────────────────────────────────
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // ──────────────────────────────────────
    // 4. Clean and parse JSON
    // ──────────────────────────────────────
    // Strip markdown fences if Claude adds them
    let cleanedResponse = responseText
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    // Sometimes Claude adds a preamble before the JSON
    const jsonStart = cleanedResponse.indexOf("{");
    if (jsonStart > 0) {
      cleanedResponse = cleanedResponse.substring(jsonStart);
    }

    // Find the last closing brace (in case Claude adds text after JSON)
    const jsonEnd = cleanedResponse.lastIndexOf("}");
    if (jsonEnd !== -1 && jsonEnd < cleanedResponse.length - 1) {
      cleanedResponse = cleanedResponse.substring(0, jsonEnd + 1);
    }

    let analysis;
    try {
      analysis = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("JSON parse error. Raw response:");
      console.error(cleanedResponse.substring(0, 500));
      return NextResponse.json(
        {
          error: "Failed to parse Claude's response as JSON. Try submitting again.",
          rawResponse: cleanedResponse.substring(0, 200),
        },
        { status: 500 }
      );
    }

    // ──────────────────────────────────────
    // 5. Validate required fields
    // ──────────────────────────────────────
    const requiredFields = ["summary", "steps", "mermaidCode", "bottlenecks", "improvements", "metrics"];
    const missingFields = requiredFields.filter((field) => !(field in analysis));

    if (missingFields.length > 0) {
      console.warn("Missing fields in response:", missingFields);
      // Don't fail — just warn. Partial results are still useful.
    }

    // ──────────────────────────────────────
    // 6. Return the analysis with metadata
    // ──────────────────────────────────────
    return NextResponse.json({
      ...analysis,
      _meta: {
        model: "claude-sonnet-4-5-20250929",
        responseTimeMs: elapsed,
        inputLength: processDescription.length,
      },
    });

  } catch (error: unknown) {
    console.error("─────────────────────────────────");
    console.error("ANTHROPIC API ERROR:");
    console.error(error);
    console.error("─────────────────────────────────");

    let errorMessage = "Failed to analyse process.";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("401")) {
        errorMessage = "Invalid API key. Check your .env.local file.";
        statusCode = 401;
      } else if (error.message.includes("429")) {
        errorMessage = "Rate limited. Wait a moment and try again.";
        statusCode = 429;
      } else if (error.message.includes("insufficient") || error.message.includes("402")) {
        errorMessage = "Insufficient API credits. Add credits at console.anthropic.com.";
        statusCode = 402;
      } else if (error.message.includes("404")) {
        errorMessage = "Model not found. Check the model name in route.ts.";
        statusCode = 404;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}