/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  LLM COST ESTIMATOR — Code Detector                     ║
 * ║  Detects LLM API calls in Python, TypeScript, JavaScript ║
 * ║  By Soham Dahivalkar | PHANTSOM                          ║
 * ╚══════════════════════════════════════════════════════════╝
 */

import * as vscode from 'vscode';
import { findModelPricing, ModelPricing } from './pricing';

export interface DetectedCall {
  /** The line number where the model string was found */
  line: number;
  /** The Range in the document covering the model string */
  range: vscode.Range;
  /** The raw model string detected (e.g., "gpt-4o") */
  modelString: string;
  /** Resolved pricing for this model */
  pricing: ModelPricing;
  /** Detected max_tokens / max_output_tokens from nearby code, or undefined */
  maxTokens: number | undefined;
  /** Detected input estimate from messages/prompt context */
  estimatedInputTokens: number | undefined;
  /** The full line text for context */
  lineText: string;
  /** Call type: chat, completion, embedding, etc. */
  callType: 'chat' | 'completion' | 'embedding' | 'messages' | 'generate' | 'unknown';
}

// ─── MODEL STRING PATTERNS ─────────────────────────────────────

/**
 * Regex to find model name strings in code.
 * Matches quoted strings that look like model identifiers.
 */
const MODEL_STRING_PATTERN = new RegExp(
  [
    // OpenAI models
    `(?:gpt-4o(?:-mini)?(?:-\\d{4}-\\d{2}-\\d{2})?)`,
    `(?:gpt-4(?:-turbo)?(?:-32k)?(?:-\\d{4}-\\d{2}-\\d{2})?)`,
    `(?:gpt-3\\.5-turbo(?:-\\d{4}-\\d{2}-\\d{2})?)`,
    `(?:o[134]-?(?:mini|pro)?(?:-\\d{4}-\\d{2}-\\d{2})?)`,
    // Anthropic models
    `(?:claude-(?:3\\.5|3-5|3|4|sonnet|opus|haiku)(?:-sonnet|-opus|-haiku)?(?:-\\d{8})?)`,
    // Google Gemini
    `(?:gemini-(?:2\\.5|2\\.0|1\\.5)-(?:pro|flash|flash-lite)(?:-\\d{3,})?)`,
    // Mistral
    `(?:mistral-(?:large|small|medium|nemo)(?:-\\d{4}-\\d{2}-\\d{2})?)`,
    `(?:codestral(?:-\\d{4}-\\d{2}-\\d{2})?)`,
    // DeepSeek
    `(?:deepseek-(?:chat|coder|reasoner))`,
    // Cohere
    `(?:command-r(?:-plus)?)`,
    // Groq / Meta LLaMA
    `(?:llama-3(?:\\.1)?-(?:8b|70b|405b)-(?:versatile|instant|chat))`,
    `(?:mixtral-8x7b-32768)`,
    // AWS Bedrock
    `(?:amazon\\.titan-text-(?:express|premier))`,
  ].join('|'),
  'gi'
);

// ─── MAX TOKENS PATTERN ─────────────────────────────────────

const MAX_TOKENS_PATTERN = /(?:max_tokens|max_output_tokens|maxTokens|max_completion_tokens)\s*[=:]\s*(\d+)/i;

// ─── API CALL PATTERNS (to determine call type) ─────────────

const CALL_PATTERNS = {
  chat: /(?:chat\.completions\.create|ChatCompletion\.create|ChatOpenAI|ChatAnthropic)/i,
  completion: /(?:completions\.create|Completion\.create)/i,
  messages: /(?:messages\.create|client\.messages)/i,
  embedding: /(?:embeddings\.create|embed)/i,
  generate: /(?:generate_content|generate|GenerativeModel)/i,
};

// ─── MAIN DETECTION FUNCTION ─────────────────────────────────

/**
 * Scan an entire document and return all detected LLM API calls with pricing.
 */
export function detectLLMCalls(document: vscode.TextDocument): DetectedCall[] {
  const results: DetectedCall[] = [];
  const text = document.getText();
  const lines = text.split('\n');

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const lineText = lines[lineIdx];

    // Skip comments
    const trimmed = lineText.trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
      continue;
    }

    // Find model strings in this line
    let match: RegExpExecArray | null;
    MODEL_STRING_PATTERN.lastIndex = 0;

    while ((match = MODEL_STRING_PATTERN.exec(lineText)) !== null) {
      const modelStr = match[0];
      const pricing = findModelPricing(modelStr);

      if (!pricing) { continue; }

      const startCol = match.index;
      const endCol = startCol + modelStr.length;
      const range = new vscode.Range(lineIdx, startCol, lineIdx, endCol);

      // Search nearby lines (±10) for max_tokens
      const maxTokens = findMaxTokensNearby(lines, lineIdx, 10);

      // Estimate input tokens from nearby messages/prompt
      const estimatedInputTokens = estimateInputTokensNearby(lines, lineIdx, 15);

      // Determine call type from surrounding context
      const callType = detectCallType(lines, lineIdx, 8);

      results.push({
        line: lineIdx,
        range,
        modelString: modelStr,
        pricing,
        maxTokens,
        estimatedInputTokens,
        lineText,
        callType,
      });
    }
  }

  return results;
}

// ─── HELPER: Find max_tokens nearby ──────────────────────────

function findMaxTokensNearby(lines: string[], currentLine: number, radius: number): number | undefined {
  const start = Math.max(0, currentLine - radius);
  const end = Math.min(lines.length - 1, currentLine + radius);

  for (let i = start; i <= end; i++) {
    const match = MAX_TOKENS_PATTERN.exec(lines[i]);
    if (match) {
      const val = parseInt(match[1], 10);
      if (val > 0 && val <= 1_000_000) {
        return val;
      }
    }
  }
  return undefined;
}

// ─── HELPER: Estimate input tokens from messages/prompt ──────

function estimateInputTokensNearby(lines: string[], currentLine: number, radius: number): number | undefined {
  const start = Math.max(0, currentLine - radius);
  const end = Math.min(lines.length - 1, currentLine + radius);
  let totalChars = 0;
  let foundMessages = false;

  for (let i = start; i <= end; i++) {
    const line = lines[i];

    // Look for message content strings
    if (/(?:messages|prompt|content|system|user|assistant)\s*[=:]/i.test(line)) {
      foundMessages = true;
    }

    // Count string content lengths as rough proxy
    const stringMatches = line.match(/["'`]([^"'`]{10,})["'`]/g);
    if (stringMatches && foundMessages) {
      for (const s of stringMatches) {
        totalChars += s.length - 2; // Remove quotes
      }
    }
  }

  if (totalChars > 0) {
    // Rough estimate: ~4 chars per token (English average)
    return Math.ceil(totalChars / 4);
  }
  return undefined;
}

// ─── HELPER: Detect API call type ────────────────────────────

function detectCallType(lines: string[], currentLine: number, radius: number): DetectedCall['callType'] {
  const start = Math.max(0, currentLine - radius);
  const end = Math.min(lines.length - 1, currentLine + radius);

  const context = lines.slice(start, end + 1).join('\n');

  for (const [type, pattern] of Object.entries(CALL_PATTERNS)) {
    if (pattern.test(context)) {
      return type as DetectedCall['callType'];
    }
  }

  return 'unknown';
}

/**
 * Quick check if a document likely contains LLM calls (fast pre-filter)
 */
export function mightContainLLMCalls(document: vscode.TextDocument): boolean {
  const text = document.getText();
  return /(?:gpt-|claude-|gemini-|mistral-|deepseek-|command-r|llama-|o1|o3|o4|codestral)/i.test(text);
}
