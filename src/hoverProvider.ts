/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  LLM COST ESTIMATOR — Hover Provider                    ║
 * ║  Rich tooltip with full pricing breakdown on hover       ║
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

export class LLMCostHoverProvider implements vscode.HoverProvider {
  private detectedCalls: DetectedCall[] = [];
  private config: {
    defaultInputTokens: number;
    defaultOutputTokens: number;
    callsPerDay: number;
    currency: string;
  };

  constructor(config: {
    defaultInputTokens: number;
    defaultOutputTokens: number;
    callsPerDay: number;
    currency: string;
  }) {
    this.config = config;
  }

  /** Update detected calls (called after each scan) */
  public updateCalls(calls: DetectedCall[]): void {
    this.detectedCalls = calls;
  }

  /** Update config */
  public updateConfig(config: typeof this.config): void {
    this.config = config;
  }

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): vscode.Hover | undefined {
    // Find if cursor is on a detected model string
    const call = this.detectedCalls.find((c) => c.range.contains(position));

    if (!call) {
      return undefined;
    }

    const inputTokens = call.estimatedInputTokens || this.config.defaultInputTokens;
    const outputTokens = call.maxTokens || this.config.defaultOutputTokens;
    const cost = calculateCallCost(call.pricing, inputTokens, outputTokens);
    cost.dailyCost = cost.totalCost * this.config.callsPerDay;
    cost.monthlyCost = cost.dailyCost * 30;

    const curr = this.config.currency;
    const emoji = getCostTierEmoji(cost.totalCost);
    const m = call.pricing;

    // Build Markdown tooltip
    const md = new vscode.MarkdownString();
    md.isTrusted = true;
    md.supportHtml = true;

    md.appendMarkdown(`## ${emoji} LLM Cost Estimator\n\n`);
    md.appendMarkdown(`---\n\n`);

    // Model Info
    md.appendMarkdown(`| | |\n|---|---|\n`);
    md.appendMarkdown(`| **Model** | \`${m.displayName}\` |\n`);
    md.appendMarkdown(`| **Provider** | ${m.provider} |\n`);
    md.appendMarkdown(`| **Tier** | ${m.tier.toUpperCase()} |\n`);
    md.appendMarkdown(`| **Context Window** | ${m.contextWindow.toLocaleString()} tokens |\n`);
    md.appendMarkdown(`| **Max Output** | ${m.maxOutput.toLocaleString()} tokens |\n`);
    md.appendMarkdown(`\n`);

    // Pricing per 1M tokens
    md.appendMarkdown(`### Pricing (per 1M tokens)\n\n`);
    md.appendMarkdown(`| Direction | Cost |\n|---|---|\n`);
    md.appendMarkdown(`| **Input** | ${formatCost(m.inputCostPer1M, curr)}/1M tokens |\n`);
    md.appendMarkdown(`| **Output** | ${formatCost(m.outputCostPer1M, curr)}/1M tokens |\n`);
    if (m.cachedInputCostPer1M) {
      md.appendMarkdown(`| **Cached Input** | ${formatCost(m.cachedInputCostPer1M, curr)}/1M tokens |\n`);
    }
    md.appendMarkdown(`\n`);

    // Estimated cost for this call
    md.appendMarkdown(`### Estimated Cost (This Call)\n\n`);
    md.appendMarkdown(`| Metric | Value |\n|---|---|\n`);
    md.appendMarkdown(`| **Input Tokens** | ~${inputTokens.toLocaleString()} ${call.estimatedInputTokens ? '(detected)' : '(default)'} |\n`);
    md.appendMarkdown(`| **Output Tokens** | ~${outputTokens.toLocaleString()} ${call.maxTokens ? '(from max_tokens)' : '(default)'} |\n`);
    md.appendMarkdown(`| **Input Cost** | ${formatCost(cost.inputCost, curr)} |\n`);
    md.appendMarkdown(`| **Output Cost** | ${formatCost(cost.outputCost, curr)} |\n`);
    md.appendMarkdown(`| **Total / Call** | **${formatCost(cost.totalCost, curr)}** |\n`);
    md.appendMarkdown(`\n`);

    // Projections
    md.appendMarkdown(`### Projections (${this.config.callsPerDay} calls/day)\n\n`);
    md.appendMarkdown(`| Period | Estimated Cost |\n|---|---|\n`);
    md.appendMarkdown(`| **Daily** | ${formatCost(cost.dailyCost, curr)} |\n`);
    md.appendMarkdown(`| **Weekly** | ${formatCost(cost.dailyCost * 7, curr)} |\n`);
    md.appendMarkdown(`| **Monthly** | ${formatCost(cost.monthlyCost, curr)} |\n`);
    md.appendMarkdown(`| **Yearly** | ${formatCost(cost.monthlyCost * 12, curr)} |\n`);
    md.appendMarkdown(`\n`);

    // Cheaper alternatives
    md.appendMarkdown(`---\n`);
    md.appendMarkdown(`*💡 Powered by [LLM Cost Estimator](https://github.com/phantsom/llm-cost-estimator) — by Soham Dahivalkar (PHANTSOM)*\n`);

    return new vscode.Hover(md, call.range);
  }
}
