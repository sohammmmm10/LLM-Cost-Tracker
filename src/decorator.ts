/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  LLM COST ESTIMATOR — Decoration Manager                ║
 * ║  Creates inline cost badges next to LLM API calls        ║
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

// ─── DECORATION TYPES ────────────────────────────────────────

let cheapDecorationType: vscode.TextEditorDecorationType;
let moderateDecorationType: vscode.TextEditorDecorationType;
let expensiveDecorationType: vscode.TextEditorDecorationType;
let premiumDecorationType: vscode.TextEditorDecorationType;

/**
 * Initialize decoration types (call once on activation)
 */
export function initDecorationTypes(): void {
  cheapDecorationType = vscode.window.createTextEditorDecorationType({
    after: {
      margin: '0 0 0 1.5em',
      color: new vscode.ThemeColor('llmCost.cheapColor'),
      fontStyle: 'italic',
      fontWeight: '400',
    },
    light: {
      after: { color: '#16a34a' },
    },
    dark: {
      after: { color: '#4ade80' },
    },
  });

  moderateDecorationType = vscode.window.createTextEditorDecorationType({
    after: {
      margin: '0 0 0 1.5em',
      fontStyle: 'italic',
      fontWeight: '400',
    },
    light: {
      after: { color: '#ca8a04' },
    },
    dark: {
      after: { color: '#facc15' },
    },
  });

  expensiveDecorationType = vscode.window.createTextEditorDecorationType({
    after: {
      margin: '0 0 0 1.5em',
      fontStyle: 'italic',
      fontWeight: '600',
    },
    light: {
      after: { color: '#ea580c' },
    },
    dark: {
      after: { color: '#fb923c' },
    },
  });

  premiumDecorationType = vscode.window.createTextEditorDecorationType({
    after: {
      margin: '0 0 0 1.5em',
      fontStyle: 'italic',
      fontWeight: '700',
    },
    light: {
      after: { color: '#dc2626' },
      backgroundColor: 'rgba(220, 38, 38, 0.08)',
    },
    dark: {
      after: { color: '#f87171' },
      backgroundColor: 'rgba(248, 113, 113, 0.06)',
    },
  });
}

/**
 * Dispose all decoration types
 */
export function disposeDecorationTypes(): void {
  cheapDecorationType?.dispose();
  moderateDecorationType?.dispose();
  expensiveDecorationType?.dispose();
  premiumDecorationType?.dispose();
}

// ─── APPLY DECORATIONS ───────────────────────────────────────

export interface DecorationResult {
  totalCostPerCall: number;
  totalDailyCost: number;
  totalMonthlyCost: number;
  callCount: number;
}

/**
 * Apply inline cost decorations to the active editor
 */
export function applyDecorations(
  editor: vscode.TextEditor,
  detectedCalls: DetectedCall[],
  config: {
    defaultInputTokens: number;
    defaultOutputTokens: number;
    callsPerDay: number;
    currency: string;
    style: string;
  }
): DecorationResult {
  const cheapDecos: vscode.DecorationOptions[] = [];
  const moderateDecos: vscode.DecorationOptions[] = [];
  const expensiveDecos: vscode.DecorationOptions[] = [];
  const premiumDecos: vscode.DecorationOptions[] = [];

  let totalCostPerCall = 0;
  let totalDailyCost = 0;
  let totalMonthlyCost = 0;

  for (const call of detectedCalls) {
    const inputTokens = call.estimatedInputTokens || config.defaultInputTokens;
    const outputTokens = call.maxTokens || config.defaultOutputTokens;

    const cost = calculateCallCost(call.pricing, inputTokens, outputTokens);
    cost.dailyCost = cost.totalCost * config.callsPerDay;
    cost.monthlyCost = cost.dailyCost * 30;

    totalCostPerCall += cost.totalCost;
    totalDailyCost += cost.dailyCost;
    totalMonthlyCost += cost.monthlyCost;

    const emoji = getCostTierEmoji(cost.totalCost);
    const formattedCost = formatCost(cost.totalCost, config.currency);
    const formattedDaily = formatCost(cost.dailyCost, config.currency);
    const formattedMonthly = formatCost(cost.monthlyCost, config.currency);

    // Build decoration text based on style
    let decoText: string;
    switch (config.style) {
      case 'minimal':
        decoText = `  ← ${formattedCost}/call`;
        break;
      case 'detailed':
        decoText = `  ← ${emoji} ${formattedCost}/call · ${formattedDaily}/day · ${formattedMonthly}/mo · ${call.pricing.provider}`;
        break;
      case 'badge':
      default:
        decoText = `  ← ${emoji} ${formattedCost}/call · ~${formattedMonthly}/mo [${call.pricing.displayName}]`;
        break;
    }

    const decoration: vscode.DecorationOptions = {
      range: new vscode.Range(call.line, call.lineText.length, call.line, call.lineText.length),
      renderOptions: {
        after: {
          contentText: decoText,
        },
      },
    };

    // Route to correct tier decoration
    if (cost.totalCost < 0.001) {
      cheapDecos.push(decoration);
    } else if (cost.totalCost < 0.01) {
      moderateDecos.push(decoration);
    } else if (cost.totalCost < 0.05) {
      expensiveDecos.push(decoration);
    } else {
      premiumDecos.push(decoration);
    }
  }

  // Apply all decorations
  editor.setDecorations(cheapDecorationType, cheapDecos);
  editor.setDecorations(moderateDecorationType, moderateDecos);
  editor.setDecorations(expensiveDecorationType, expensiveDecos);
  editor.setDecorations(premiumDecorationType, premiumDecos);

  return {
    totalCostPerCall,
    totalDailyCost,
    totalMonthlyCost,
    callCount: detectedCalls.length,
  };
}

/**
 * Clear all decorations from the editor
 */
export function clearDecorations(editor: vscode.TextEditor): void {
  editor.setDecorations(cheapDecorationType, []);
  editor.setDecorations(moderateDecorationType, []);
  editor.setDecorations(expensiveDecorationType, []);
  editor.setDecorations(premiumDecorationType, []);
}
