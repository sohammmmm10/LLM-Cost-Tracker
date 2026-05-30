/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  LLM COST ESTIMATOR — CodeLens Provider                 ║
 * ║  Shows cost info above each LLM API call line            ║
 * ║  By Soham Dahivalkar | PHANTSOM                          ║
 * ╚══════════════════════════════════════════════════════════╝
 */

import * as vscode from 'vscode';
import { DetectedCall } from './detector';
import {
  calculateCallCost,
  formatCost,
  getCostTierEmoji,
} from './pricing';

export class LLMCostCodeLensProvider implements vscode.CodeLensProvider {
  private detectedCalls: DetectedCall[] = [];
  private config: {
    defaultInputTokens: number;
    defaultOutputTokens: number;
    callsPerDay: number;
    currency: string;
  };

  private _onDidChangeCodeLenses = new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;

  constructor(config: {
    defaultInputTokens: number;
    defaultOutputTokens: number;
    callsPerDay: number;
    currency: string;
  }) {
    this.config = config;
  }

  /** Update detected calls */
  public updateCalls(calls: DetectedCall[]): void {
    this.detectedCalls = calls;
    this._onDidChangeCodeLenses.fire();
  }

  /** Update config */
  public updateConfig(config: typeof this.config): void {
    this.config = config;
    this._onDidChangeCodeLenses.fire();
  }

  provideCodeLenses(
    _document: vscode.TextDocument,
    _token: vscode.CancellationToken
  ): vscode.CodeLens[] {
    const lenses: vscode.CodeLens[] = [];

    for (const call of this.detectedCalls) {
      const inputTokens = call.estimatedInputTokens || this.config.defaultInputTokens;
      const outputTokens = call.maxTokens || this.config.defaultOutputTokens;
      const cost = calculateCallCost(call.pricing, inputTokens, outputTokens);
      cost.dailyCost = cost.totalCost * this.config.callsPerDay;
      cost.monthlyCost = cost.dailyCost * 30;

      const curr = this.config.currency;
      const emoji = getCostTierEmoji(cost.totalCost);

      const range = new vscode.Range(call.line, 0, call.line, 0);

      // Main cost lens
      lenses.push(
        new vscode.CodeLens(range, {
          title: `${emoji} ${call.pricing.displayName} — ${formatCost(cost.totalCost, curr)}/call · ${formatCost(cost.monthlyCost, curr)}/mo (${this.config.callsPerDay} calls/day)`,
          command: 'llmCost.showFileSummary',
          tooltip: `Click to see full cost summary for this file`,
        })
      );

      // Cheaper alternative suggestion (if expensive)
      if (cost.totalCost > 0.01) {
        const suggestion = getSuggestion(call.pricing.provider, cost.totalCost);
        if (suggestion) {
          lenses.push(
            new vscode.CodeLens(range, {
              title: `💡 ${suggestion}`,
              command: '',
              tooltip: 'Consider using a cheaper model for this use case',
            })
          );
        }
      }
    }

    return lenses;
  }
}

// ─── CHEAPER MODEL SUGGESTIONS ───────────────────────────────

function getSuggestion(provider: string, costPerCall: number): string | undefined {
  if (costPerCall > 0.05) {
    switch (provider) {
      case 'OpenAI':
        return 'Consider gpt-4o-mini ($0.15/$0.60 per 1M) — 97% quality at 3% of the cost';
      case 'Anthropic':
        return 'Consider claude-3.5-haiku ($0.80/$4.00 per 1M) — fast & cheap alternative';
      case 'Google':
        return 'Consider gemini-2.0-flash ($0.10/$0.40 per 1M) — great for most tasks';
      default:
        return 'Consider using a smaller/cheaper model for this call';
    }
  }

  if (costPerCall > 0.01) {
    switch (provider) {
      case 'OpenAI':
        return 'Tip: gpt-4o-mini handles most tasks well at fraction of gpt-4o cost';
      case 'Anthropic':
        return 'Tip: claude-3-haiku is 12x cheaper than sonnet for simpler tasks';
      default:
        return undefined;
    }
  }

  return undefined;
}
