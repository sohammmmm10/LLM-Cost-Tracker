/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  LLM COST ESTIMATOR — Pricing Database                  ║
 * ║  By Soham Dahivalkar | PHANTSOM                          ║
 * ║  Covers: OpenAI, Anthropic, Google, Mistral,             ║
 * ║          Cohere, DeepSeek, Meta (via API), Groq           ║
 * ╚══════════════════════════════════════════════════════════╝
 */

export interface ModelPricing {
  /** Model identifier (as used in API calls) */
  id: string;
  /** Human-friendly display name */
  displayName: string;
  /** Provider name */
  provider: string;
  /** Cost per 1 MILLION input tokens in USD */
  inputCostPer1M: number;
  /** Cost per 1 MILLION output tokens in USD */
  outputCostPer1M: number;
  /** Maximum context window (tokens) */
  contextWindow: number;
  /** Maximum output tokens */
  maxOutput: number;
  /** Optional: cached input cost per 1M tokens */
  cachedInputCostPer1M?: number;
  /** Model tier: cheap | moderate | expensive | premium */
  tier: 'cheap' | 'moderate' | 'expensive' | 'premium';
}

/**
 * Master pricing table — updated May 2025
 * Sources: Official pricing pages of each provider
 */
export const MODEL_PRICING: ModelPricing[] = [

  // ═══════════════════════════════════════════
  //  OPENAI
  // ═══════════════════════════════════════════
  {
    id: 'gpt-4o',
    displayName: 'GPT-4o',
    provider: 'OpenAI',
    inputCostPer1M: 2.50,
    outputCostPer1M: 10.00,
    cachedInputCostPer1M: 1.25,
    contextWindow: 128000,
    maxOutput: 16384,
    tier: 'moderate',
  },
  {
    id: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    provider: 'OpenAI',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    cachedInputCostPer1M: 0.075,
    contextWindow: 128000,
    maxOutput: 16384,
    tier: 'cheap',
  },
  {
    id: 'gpt-4-turbo',
    displayName: 'GPT-4 Turbo',
    provider: 'OpenAI',
    inputCostPer1M: 10.00,
    outputCostPer1M: 30.00,
    contextWindow: 128000,
    maxOutput: 4096,
    tier: 'expensive',
  },
  {
    id: 'gpt-4',
    displayName: 'GPT-4',
    provider: 'OpenAI',
    inputCostPer1M: 30.00,
    outputCostPer1M: 60.00,
    contextWindow: 8192,
    maxOutput: 8192,
    tier: 'premium',
  },
  {
    id: 'gpt-4-32k',
    displayName: 'GPT-4 32K',
    provider: 'OpenAI',
    inputCostPer1M: 60.00,
    outputCostPer1M: 120.00,
    contextWindow: 32768,
    maxOutput: 32768,
    tier: 'premium',
  },
  {
    id: 'gpt-3.5-turbo',
    displayName: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    inputCostPer1M: 0.50,
    outputCostPer1M: 1.50,
    contextWindow: 16385,
    maxOutput: 4096,
    tier: 'cheap',
  },
  {
    id: 'o1',
    displayName: 'o1',
    provider: 'OpenAI',
    inputCostPer1M: 15.00,
    outputCostPer1M: 60.00,
    cachedInputCostPer1M: 7.50,
    contextWindow: 200000,
    maxOutput: 100000,
    tier: 'premium',
  },
  {
    id: 'o1-mini',
    displayName: 'o1-mini',
    provider: 'OpenAI',
    inputCostPer1M: 3.00,
    outputCostPer1M: 12.00,
    cachedInputCostPer1M: 1.50,
    contextWindow: 128000,
    maxOutput: 65536,
    tier: 'moderate',
  },
  {
    id: 'o1-pro',
    displayName: 'o1-pro',
    provider: 'OpenAI',
    inputCostPer1M: 150.00,
    outputCostPer1M: 600.00,
    contextWindow: 200000,
    maxOutput: 100000,
    tier: 'premium',
  },
  {
    id: 'o3',
    displayName: 'o3',
    provider: 'OpenAI',
    inputCostPer1M: 10.00,
    outputCostPer1M: 40.00,
    cachedInputCostPer1M: 2.50,
    contextWindow: 200000,
    maxOutput: 100000,
    tier: 'expensive',
  },
  {
    id: 'o3-mini',
    displayName: 'o3-mini',
    provider: 'OpenAI',
    inputCostPer1M: 1.10,
    outputCostPer1M: 4.40,
    cachedInputCostPer1M: 0.55,
    contextWindow: 200000,
    maxOutput: 100000,
    tier: 'moderate',
  },
  {
    id: 'o4-mini',
    displayName: 'o4-mini',
    provider: 'OpenAI',
    inputCostPer1M: 1.10,
    outputCostPer1M: 4.40,
    cachedInputCostPer1M: 0.275,
    contextWindow: 200000,
    maxOutput: 100000,
    tier: 'moderate',
  },

  // ═══════════════════════════════════════════
  //  ANTHROPIC
  // ═══════════════════════════════════════════
  {
    id: 'claude-3-opus',
    displayName: 'Claude 3 Opus',
    provider: 'Anthropic',
    inputCostPer1M: 15.00,
    outputCostPer1M: 75.00,
    cachedInputCostPer1M: 7.50,
    contextWindow: 200000,
    maxOutput: 4096,
    tier: 'premium',
  },
  {
    id: 'claude-3-sonnet',
    displayName: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    contextWindow: 200000,
    maxOutput: 4096,
    tier: 'moderate',
  },
  {
    id: 'claude-3-haiku',
    displayName: 'Claude 3 Haiku',
    provider: 'Anthropic',
    inputCostPer1M: 0.25,
    outputCostPer1M: 1.25,
    cachedInputCostPer1M: 0.03,
    contextWindow: 200000,
    maxOutput: 4096,
    tier: 'cheap',
  },
  {
    id: 'claude-3.5-sonnet',
    displayName: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    cachedInputCostPer1M: 1.50,
    contextWindow: 200000,
    maxOutput: 8192,
    tier: 'moderate',
  },
  {
    id: 'claude-3-5-sonnet',
    displayName: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    cachedInputCostPer1M: 1.50,
    contextWindow: 200000,
    maxOutput: 8192,
    tier: 'moderate',
  },
  {
    id: 'claude-3.5-haiku',
    displayName: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    inputCostPer1M: 0.80,
    outputCostPer1M: 4.00,
    cachedInputCostPer1M: 0.08,
    contextWindow: 200000,
    maxOutput: 8192,
    tier: 'cheap',
  },
  {
    id: 'claude-4-sonnet',
    displayName: 'Claude 4 Sonnet',
    provider: 'Anthropic',
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    cachedInputCostPer1M: 1.50,
    contextWindow: 200000,
    maxOutput: 16384,
    tier: 'moderate',
  },
  {
    id: 'claude-4-opus',
    displayName: 'Claude 4 Opus',
    provider: 'Anthropic',
    inputCostPer1M: 15.00,
    outputCostPer1M: 75.00,
    cachedInputCostPer1M: 7.50,
    contextWindow: 200000,
    maxOutput: 32000,
    tier: 'premium',
  },
  {
    id: 'claude-sonnet-4',
    displayName: 'Claude Sonnet 4',
    provider: 'Anthropic',
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    cachedInputCostPer1M: 1.50,
    contextWindow: 200000,
    maxOutput: 16384,
    tier: 'moderate',
  },

  // ═══════════════════════════════════════════
  //  GOOGLE GEMINI
  // ═══════════════════════════════════════════
  {
    id: 'gemini-2.0-flash',
    displayName: 'Gemini 2.0 Flash',
    provider: 'Google',
    inputCostPer1M: 0.10,
    outputCostPer1M: 0.40,
    contextWindow: 1048576,
    maxOutput: 8192,
    tier: 'cheap',
  },
  {
    id: 'gemini-2.0-flash-lite',
    displayName: 'Gemini 2.0 Flash Lite',
    provider: 'Google',
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.30,
    contextWindow: 1048576,
    maxOutput: 8192,
    tier: 'cheap',
  },
  {
    id: 'gemini-1.5-pro',
    displayName: 'Gemini 1.5 Pro',
    provider: 'Google',
    inputCostPer1M: 1.25,
    outputCostPer1M: 5.00,
    cachedInputCostPer1M: 0.3125,
    contextWindow: 2097152,
    maxOutput: 8192,
    tier: 'moderate',
  },
  {
    id: 'gemini-1.5-flash',
    displayName: 'Gemini 1.5 Flash',
    provider: 'Google',
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.30,
    cachedInputCostPer1M: 0.01875,
    contextWindow: 1048576,
    maxOutput: 8192,
    tier: 'cheap',
  },
  {
    id: 'gemini-2.5-pro',
    displayName: 'Gemini 2.5 Pro',
    provider: 'Google',
    inputCostPer1M: 1.25,
    outputCostPer1M: 10.00,
    contextWindow: 1048576,
    maxOutput: 65536,
    tier: 'moderate',
  },
  {
    id: 'gemini-2.5-flash',
    displayName: 'Gemini 2.5 Flash',
    provider: 'Google',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    contextWindow: 1048576,
    maxOutput: 65536,
    tier: 'cheap',
  },

  // ═══════════════════════════════════════════
  //  MISTRAL
  // ═══════════════════════════════════════════
  {
    id: 'mistral-large',
    displayName: 'Mistral Large',
    provider: 'Mistral',
    inputCostPer1M: 2.00,
    outputCostPer1M: 6.00,
    contextWindow: 128000,
    maxOutput: 8192,
    tier: 'moderate',
  },
  {
    id: 'mistral-small',
    displayName: 'Mistral Small',
    provider: 'Mistral',
    inputCostPer1M: 0.20,
    outputCostPer1M: 0.60,
    contextWindow: 128000,
    maxOutput: 8192,
    tier: 'cheap',
  },
  {
    id: 'mistral-medium',
    displayName: 'Mistral Medium',
    provider: 'Mistral',
    inputCostPer1M: 2.70,
    outputCostPer1M: 8.10,
    contextWindow: 32000,
    maxOutput: 8192,
    tier: 'moderate',
  },
  {
    id: 'codestral',
    displayName: 'Codestral',
    provider: 'Mistral',
    inputCostPer1M: 0.30,
    outputCostPer1M: 0.90,
    contextWindow: 256000,
    maxOutput: 8192,
    tier: 'cheap',
  },
  {
    id: 'mistral-nemo',
    displayName: 'Mistral Nemo',
    provider: 'Mistral',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.15,
    contextWindow: 128000,
    maxOutput: 8192,
    tier: 'cheap',
  },

  // ═══════════════════════════════════════════
  //  DEEPSEEK
  // ═══════════════════════════════════════════
  {
    id: 'deepseek-chat',
    displayName: 'DeepSeek V3',
    provider: 'DeepSeek',
    inputCostPer1M: 0.27,
    outputCostPer1M: 1.10,
    cachedInputCostPer1M: 0.07,
    contextWindow: 64000,
    maxOutput: 8192,
    tier: 'cheap',
  },
  {
    id: 'deepseek-reasoner',
    displayName: 'DeepSeek R1',
    provider: 'DeepSeek',
    inputCostPer1M: 0.55,
    outputCostPer1M: 2.19,
    cachedInputCostPer1M: 0.14,
    contextWindow: 64000,
    maxOutput: 8192,
    tier: 'cheap',
  },
  {
    id: 'deepseek-coder',
    displayName: 'DeepSeek Coder',
    provider: 'DeepSeek',
    inputCostPer1M: 0.14,
    outputCostPer1M: 0.28,
    contextWindow: 128000,
    maxOutput: 8192,
    tier: 'cheap',
  },

  // ═══════════════════════════════════════════
  //  COHERE
  // ═══════════════════════════════════════════
  {
    id: 'command-r-plus',
    displayName: 'Command R+',
    provider: 'Cohere',
    inputCostPer1M: 2.50,
    outputCostPer1M: 10.00,
    contextWindow: 128000,
    maxOutput: 4096,
    tier: 'moderate',
  },
  {
    id: 'command-r',
    displayName: 'Command R',
    provider: 'Cohere',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    contextWindow: 128000,
    maxOutput: 4096,
    tier: 'cheap',
  },

  // ═══════════════════════════════════════════
  //  GROQ (Inference hosting)
  // ═══════════════════════════════════════════
  {
    id: 'llama-3.1-70b-versatile',
    displayName: 'LLaMA 3.1 70B (Groq)',
    provider: 'Groq',
    inputCostPer1M: 0.59,
    outputCostPer1M: 0.79,
    contextWindow: 131072,
    maxOutput: 8192,
    tier: 'cheap',
  },
  {
    id: 'llama-3.1-8b-instant',
    displayName: 'LLaMA 3.1 8B (Groq)',
    provider: 'Groq',
    inputCostPer1M: 0.05,
    outputCostPer1M: 0.08,
    contextWindow: 131072,
    maxOutput: 8192,
    tier: 'cheap',
  },
  {
    id: 'mixtral-8x7b-32768',
    displayName: 'Mixtral 8x7B (Groq)',
    provider: 'Groq',
    inputCostPer1M: 0.24,
    outputCostPer1M: 0.24,
    contextWindow: 32768,
    maxOutput: 8192,
    tier: 'cheap',
  },

  // ═══════════════════════════════════════════
  //  AMAZON BEDROCK / AWS
  // ═══════════════════════════════════════════
  {
    id: 'amazon.titan-text-express',
    displayName: 'Amazon Titan Text Express',
    provider: 'AWS Bedrock',
    inputCostPer1M: 0.20,
    outputCostPer1M: 0.60,
    contextWindow: 8192,
    maxOutput: 4096,
    tier: 'cheap',
  },
  {
    id: 'amazon.titan-text-premier',
    displayName: 'Amazon Titan Text Premier',
    provider: 'AWS Bedrock',
    inputCostPer1M: 0.50,
    outputCostPer1M: 1.50,
    contextWindow: 32000,
    maxOutput: 8192,
    tier: 'cheap',
  },
];

// ─── LOOKUP HELPERS ───────────────────────────────────

/** Build a Map for O(1) lookups by model ID */
const pricingMap = new Map<string, ModelPricing>();
for (const model of MODEL_PRICING) {
  pricingMap.set(model.id.toLowerCase(), model);
}

/**
 * Find pricing for a model string.
 * Tries exact match first, then fuzzy substring match.
 */
export function findModelPricing(modelStr: string): ModelPricing | undefined {
  const clean = modelStr.toLowerCase().trim().replace(/['"]/g, '');

  // Exact match
  if (pricingMap.has(clean)) {
    return pricingMap.get(clean);
  }

  // Substring match — e.g. "claude-3-5-sonnet-20241022" should match "claude-3-5-sonnet"
  for (const model of MODEL_PRICING) {
    if (clean.includes(model.id.toLowerCase()) || model.id.toLowerCase().includes(clean)) {
      return model;
    }
  }

  // Fuzzy — handle date-suffixed model IDs like "gpt-4o-2024-08-06"
  const baseModel = clean.replace(/-\d{4}-?\d{2}-?\d{2}$/, '').replace(/-latest$/, '');
  if (pricingMap.has(baseModel)) {
    return pricingMap.get(baseModel);
  }

  return undefined;
}

/**
 * Calculate cost for a single API call
 */
export function calculateCallCost(
  model: ModelPricing,
  inputTokens: number,
  outputTokens: number,
  useCachedInput: boolean = false
): {
  inputCost: number;
  outputCost: number;
  totalCost: number;
  dailyCost: number;
  monthlyCost: number;
} {
  const inputRate = useCachedInput && model.cachedInputCostPer1M
    ? model.cachedInputCostPer1M
    : model.inputCostPer1M;

  const inputCost = (inputTokens / 1_000_000) * inputRate;
  const outputCost = (outputTokens / 1_000_000) * model.outputCostPer1M;
  const totalCost = inputCost + outputCost;

  return {
    inputCost,
    outputCost,
    totalCost,
    dailyCost: totalCost * 100,     // assume 100 calls/day default
    monthlyCost: totalCost * 100 * 30,
  };
}

/**
 * Get all unique provider names
 */
export function getProviders(): string[] {
  const providers = new Set<string>();
  for (const m of MODEL_PRICING) {
    providers.add(m.provider);
  }
  return Array.from(providers).sort();
}

/**
 * Get cost tier label
 */
export function getCostTierEmoji(costPerCall: number): string {
  if (costPerCall < 0.001) { return '🟢'; }    // < $0.001 — very cheap
  if (costPerCall < 0.01) { return '🟡'; }     // < $0.01  — cheap
  if (costPerCall < 0.05) { return '🟠'; }     // < $0.05  — moderate
  if (costPerCall < 0.10) { return '🔴'; }     // < $0.10  — expensive
  return '💀';                                   // > $0.10  — very expensive
}

/**
 * Format currency
 */
export function formatCost(amount: number, currency: string = 'USD'): string {
  const rates: Record<string, { symbol: string; rate: number }> = {
    USD: { symbol: '$', rate: 1 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
    INR: { symbol: '₹', rate: 83.5 },
    JPY: { symbol: '¥', rate: 155.0 },
  };

  const conv = rates[currency] || rates['USD'];
  const converted = amount * conv.rate;

  if (converted < 0.0001) {
    return `${conv.symbol}${converted.toExponential(2)}`;
  }
  if (converted < 0.01) {
    return `${conv.symbol}${converted.toFixed(4)}`;
  }
  if (converted < 1) {
    return `${conv.symbol}${converted.toFixed(3)}`;
  }
  return `${conv.symbol}${converted.toFixed(2)}`;
}
