/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  LLM COST ESTIMATOR — Status Bar Manager                ║
 * ║  Shows total file cost in the VS Code status bar         ║
 * ║  By Soham Dahivalkar | PHANTSOM                          ║
 * ╚══════════════════════════════════════════════════════════╝
 */

import * as vscode from 'vscode';
import { DecorationResult } from './decorator';
import { formatCost } from './pricing';

let statusBarItem: vscode.StatusBarItem;

/**
 * Initialize the status bar item
 */
export function initStatusBar(): void {
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = 'llmCost.showFileSummary';
  statusBarItem.tooltip = 'Click for LLM cost breakdown';
  statusBarItem.show();
  updateStatusBarIdle();
}

/**
 * Update status bar with scan results
 */
export function updateStatusBar(
  result: DecorationResult,
  currency: string,
  monthlyBudget: number
): void {
  if (result.callCount === 0) {
    updateStatusBarIdle();
    return;
  }

  const monthlyCost = formatCost(result.totalMonthlyCost, currency);
  const callCount = result.callCount;

  let icon = '$(pulse)';
  let budgetWarning = '';

  // Budget alert
  if (monthlyBudget > 0 && result.totalMonthlyCost > monthlyBudget) {
    icon = '$(warning)';
    budgetWarning = ' ⚠️ OVER BUDGET';
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
  } else if (monthlyBudget > 0 && result.totalMonthlyCost > monthlyBudget * 0.8) {
    icon = '$(alert)';
    budgetWarning = ' ⚠️ 80% budget';
    statusBarItem.backgroundColor = undefined;
  } else {
    statusBarItem.backgroundColor = undefined;
  }

  statusBarItem.text = `${icon} LLM: ${callCount} call${callCount > 1 ? 's' : ''} · ~${monthlyCost}/mo${budgetWarning}`;
  statusBarItem.tooltip = `LLM Cost Estimator\n${callCount} API call(s) detected\nEst. ${monthlyCost}/month\nClick for details`;
  statusBarItem.show();
}

/**
 * Show idle state (no LLM calls found)
 */
export function updateStatusBarIdle(): void {
  statusBarItem.text = '$(pulse) LLM: No calls';
  statusBarItem.tooltip = 'LLM Cost Estimator — No API calls detected in this file';
  statusBarItem.backgroundColor = undefined;
  statusBarItem.show();
}

/**
 * Hide the status bar
 */
export function hideStatusBar(): void {
  statusBarItem?.hide();
}

/**
 * Dispose the status bar
 */
export function disposeStatusBar(): void {
  statusBarItem?.dispose();
}

/**
 * Show a detailed cost summary as an information message with actions
 */
export async function showCostSummary(
  result: DecorationResult,
  currency: string
): Promise<void> {
  if (result.callCount === 0) {
    vscode.window.showInformationMessage(
      'LLM Cost Estimator: No LLM API calls detected in this file.'
    );
    return;
  }

  const perCall = formatCost(result.totalCostPerCall, currency);
  const daily = formatCost(result.totalDailyCost, currency);
  const monthly = formatCost(result.totalMonthlyCost, currency);
  const yearly = formatCost(result.totalMonthlyCost * 12, currency);

  const msg = [
    `📊 LLM Cost Summary for This File`,
    ``,
    `API Calls Found: ${result.callCount}`,
    `Cost per Execution: ${perCall}`,
    `Daily Estimate: ${daily}`,
    `Monthly Estimate: ${monthly}`,
    `Yearly Estimate: ${yearly}`,
  ].join('\n');

  const action = await vscode.window.showInformationMessage(
    `LLM Cost: ${result.callCount} call(s) · ${perCall}/run · ~${monthly}/month · ~${yearly}/year`,
    'Copy Summary',
    'OK'
  );

  if (action === 'Copy Summary') {
    await vscode.env.clipboard.writeText(msg);
    vscode.window.showInformationMessage('Cost summary copied to clipboard!');
  }
}
