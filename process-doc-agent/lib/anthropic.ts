// lib/anthropic.ts
// ─────────────────────────────────────────────
// Reusable Anthropic client for server-side use
// This file is imported by API routes only
// ─────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";

// Create the client
// It automatically reads ANTHROPIC_API_KEY from .env.local
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default anthropic;