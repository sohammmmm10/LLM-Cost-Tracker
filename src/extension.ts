/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║                                                              ║
 * ║   LLM COST ESTIMATOR — VS Code Extension                    ║
 * ║   Inline cost estimates for every LLM API call               ║
 * ║                                                              ║
 * ║   Author:  Soham Dahivalkar                                  ║
 * ║   Brand:   PHANTSOM                                          ║
 * ║   License: MIT                                               ║
 * ║   Version: 1.0.0                                             ║
 * ║                                                              ║
 * ║   Supports: OpenAI, Anthropic, Google Gemini, Mistral,       ║
 * ║             DeepSeek, Cohere, Groq, AWS Bedrock              ║
 * ║                                                              ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import * as vscode from 'vscode';
import { detectLLMCalls, mightContainLLMCalls, DetectedCall } from './detector';
import {
  initDecorationTypes,
  disposeDecorationTypes,
  applyDecorations,
  clearDecorations,
  DecorationResult,
} from './decorator';
import { LLMCostHoverProvider } from './hoverProvider';
import { LLMCostCodeLensProvider } from './codeLensProvider';
import {
  initStatusBar,
  updateStatusBar,
  updateStatusBarIdle,
  disposeStatusBar,
  showCostSummary,
} from './statusBar';

// ─── STATE ───────────────────────────────────────────────────

let isEnabled = true;
let lastResult: DecorationResult = {
  totalCostPerCall: 0,
  totalDailyCost: 0,
  totalMonthlyCost: 0,
  callCount: 0,
};
let lastDetectedCalls: DetectedCall[] = [];
let hoverProvider: LLMCostHoverProvider;
let codeLensProvider: LLMCostCodeLensProvider;
let scanDebounceTimer: NodeJS.Timeout | undefined;

// ─── CONFIGURATION ───────────────────────────────────────────

function getConfig() {
  const cfg = vscode.workspace.getConfiguration('llmCost');
  return {
    enabled: cfg.get<boolean>('enabled', true),
    defaultInputTokens: cfg.get<number>('defaultInputTokens', 500),
    defaultOutputTokens: cfg.get<number>('defaultOutputTokens', 300),
    callsPerDay: cfg.get<number>('callsPerDay', 100),
    currency: cfg.get<string>('currency', 'USD'),
    monthlyBudget: cfg.get<number>('monthlyBudget', 0),
    showCodeLens: cfg.get<boolean>('showCodeLens', true),
    showStatusBar: cfg.get<boolean>('showStatusBar', true),
    showHoverDetails: cfg.get<boolean>('showHoverDetails', true),
    decorationStyle: cfg.get<string>('decorationStyle', 'badge'),
  };
}

// ─── CORE SCAN FUNCTION ──────────────────────────────────────

function scanActiveEditor(): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    updateStatusBarIdle();
    return;
  }

  const config = getConfig();

  if (!config.enabled || !isEnabled) {
    clearDecorations(editor);
    updateStatusBarIdle();
    return;
  }

  const document = editor.document;

  // Quick pre-filter
  if (!mightContainLLMCalls(document)) {
    clearDecorations(editor);
    updateStatusBarIdle();
    lastDetectedCalls = [];
    hoverProvider?.updateCalls([]);
    codeLensProvider?.updateCalls([]);
    return;
  }

  // Full detection
  const detectedCalls = detectLLMCalls(document);
  lastDetectedCalls = detectedCalls;

  if (detectedCalls.length === 0) {
    clearDecorations(editor);
    updateStatusBarIdle();
    hoverProvider?.updateCalls([]);
    codeLensProvider?.updateCalls([]);
    return;
  }

  // Apply decorations
  lastResult = applyDecorations(editor, detectedCalls, {
    defaultInputTokens: config.defaultInputTokens,
    defaultOutputTokens: config.defaultOutputTokens,
    callsPerDay: config.callsPerDay,
    currency: config.currency,
    style: config.decorationStyle,
  });

  // Update status bar
  if (config.showStatusBar) {
    updateStatusBar(lastResult, config.currency, config.monthlyBudget);
  }

  // Update hover + codelens providers
  hoverProvider?.updateCalls(detectedCalls);
  codeLensProvider?.updateCalls(detectedCalls);

  // Budget alert (one-time notification per session)
  checkBudgetAlert(config);
}

/** Debounced scan — avoids thrashing on rapid edits */
function debouncedScan(): void {
  if (scanDebounceTimer) {
    clearTimeout(scanDebounceTimer);
  }
  scanDebounceTimer = setTimeout(scanActiveEditor, 400);
}

// ─── BUDGET ALERT ────────────────────────────────────────────

let budgetAlertShown = false;

function checkBudgetAlert(config: ReturnType<typeof getConfig>): void {
  if (budgetAlertShown || config.monthlyBudget <= 0) {
    return;
  }

  if (lastResult.totalMonthlyCost > config.monthlyBudget) {
    budgetAlertShown = true;
    vscode.window.showWarningMessage(
      `⚠️ LLM Cost Alert: Estimated monthly cost ($${lastResult.totalMonthlyCost.toFixed(2)}) exceeds your budget ($${config.monthlyBudget.toFixed(2)})!`,
      'View Details',
      'Dismiss'
    ).then((action) => {
      if (action === 'View Details') {
        showCostSummary(lastResult, config.currency);
      }
    });
  }
}

// ─── ACTIVATION ──────────────────────────────────────────────

export function activate(context: vscode.ExtensionContext): void {
  console.log('[LLM Cost Estimator] Activating — by Soham Dahivalkar (PHANTSOM)');

  const config = getConfig();

  // Initialize decoration types
  initDecorationTypes();

  // Initialize status bar
  initStatusBar();

  // Initialize hover provider
  hoverProvider = new LLMCostHoverProvider({
    defaultInputTokens: config.defaultInputTokens,
    defaultOutputTokens: config.defaultOutputTokens,
    callsPerDay: config.callsPerDay,
    currency: config.currency,
  });

  // Initialize CodeLens provider
  codeLensProvider = new LLMCostCodeLensProvider({
    defaultInputTokens: config.defaultInputTokens,
    defaultOutputTokens: config.defaultOutputTokens,
    callsPerDay: config.callsPerDay,
    currency: config.currency,
  });

  // Register hover provider for supported languages
  const languages = ['python', 'typescript', 'javascript', 'typescriptreact', 'javascriptreact'];

  for (const lang of languages) {
    if (config.showHoverDetails) {
      context.subscriptions.push(
        vscode.languages.registerHoverProvider({ language: lang }, hoverProvider)
      );
    }

    if (config.showCodeLens) {
      context.subscriptions.push(
        vscode.languages.registerCodeLensProvider({ language: lang }, codeLensProvider)
      );
    }
  }

  // ─── REGISTER COMMANDS ──────────────────────────────────

  // Toggle inline cost display
  context.subscriptions.push(
    vscode.commands.registerCommand('llmCost.toggleInlineCosts', () => {
      isEnabled = !isEnabled;
      const state = isEnabled ? 'enabled' : 'disabled';
      vscode.window.showInformationMessage(`LLM Cost Estimator: Inline costs ${state}`);

      if (isEnabled) {
        scanActiveEditor();
      } else {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          clearDecorations(editor);
        }
        updateStatusBarIdle();
      }
    })
  );

  // Show file summary
  context.subscriptions.push(
    vscode.commands.registerCommand('llmCost.showFileSummary', () => {
      showCostSummary(lastResult, getConfig().currency);
    })
  );

  // Refresh pricing
  context.subscriptions.push(
    vscode.commands.registerCommand('llmCost.refreshPricing', () => {
      scanActiveEditor();
      vscode.window.showInformationMessage('LLM Cost Estimator: Costs refreshed!');
    })
  );

  // Set monthly budget
  context.subscriptions.push(
    vscode.commands.registerCommand('llmCost.setMonthlyBudget', async () => {
      const input = await vscode.window.showInputBox({
        prompt: 'Enter your monthly LLM budget in USD (0 to disable)',
        placeHolder: 'e.g., 50',
        validateInput: (value) => {
          const num = parseFloat(value);
          if (isNaN(num) || num < 0) {
            return 'Please enter a valid positive number (or 0 to disable)';
          }
          return null;
        },
      });

      if (input !== undefined) {
        const budget = parseFloat(input);
        await vscode.workspace.getConfiguration('llmCost').update('monthlyBudget', budget, true);
        budgetAlertShown = false;
        vscode.window.showInformationMessage(
          budget > 0
            ? `LLM Cost: Monthly budget set to $${budget.toFixed(2)}`
            : 'LLM Cost: Budget alerts disabled'
        );
        scanActiveEditor();
      }
    })
  );

  // ─── EVENT LISTENERS ────────────────────────────────────

  // Scan on active editor change
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(() => {
      scanActiveEditor();
    })
  );

  // Scan on document edit (debounced)
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && event.document === editor.document) {
        debouncedScan();
      }
    })
  );

  // Re-scan on document save
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(() => {
      scanActiveEditor();
    })
  );

  // Re-read config on change
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('llmCost')) {
        const newConfig = getConfig();
        hoverProvider.updateConfig({
          defaultInputTokens: newConfig.defaultInputTokens,
          defaultOutputTokens: newConfig.defaultOutputTokens,
          callsPerDay: newConfig.callsPerDay,
          currency: newConfig.currency,
        });
        codeLensProvider.updateConfig({
          defaultInputTokens: newConfig.defaultInputTokens,
          defaultOutputTokens: newConfig.defaultOutputTokens,
          callsPerDay: newConfig.callsPerDay,
          currency: newConfig.currency,
        });
        scanActiveEditor();
      }
    })
  );

  // ─── INITIAL SCAN ──────────────────────────────────────

  scanActiveEditor();

  console.log('[LLM Cost Estimator] Activated successfully — scanning for LLM API calls');
}

// ─── DEACTIVATION ────────────────────────────────────────────

export function deactivate(): void {
  if (scanDebounceTimer) {
    clearTimeout(scanDebounceTimer);
  }
  disposeDecorationTypes();
  disposeStatusBar();
  console.log('[LLM Cost Estimator] Deactivated');
}
