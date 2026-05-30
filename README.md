# LLM Cost Estimator ⚡

> **Know what every LLM API call costs — before it hits your bill.**

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue?logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=phantsom.llm-cost-estimator)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Made by PHANTSOM](https://img.shields.io/badge/Made%20by-PHANTSOM-blueviolet)](https://github.com/phantsom)

---

## What It Does

**LLM Cost Estimator** scans your Python / TypeScript / JavaScript code and shows **real-time inline cost estimates** next to every LLM API call. No more surprise bills.

```python
response = client.chat.completions.create(
    model="gpt-4o",          # ← 🟡 $0.003/call · ~$9.00/mo [GPT-4o]
    messages=messages,
    max_tokens=1000
)
```

---

## Features

### 1. Inline Cost Badges
Color-coded cost decorations appear at the end of every line containing an LLM model reference:
- 🟢 **Green** — Very cheap (< $0.001/call)
- 🟡 **Yellow** — Moderate ($0.001–$0.01/call)
- 🟠 **Orange** — Expensive ($0.01–$0.05/call)
- 🔴 **Red** — Very expensive (> $0.05/call)
- 💀 **Skull** — Dangerously expensive (> $0.10/call)

### 2. Rich Hover Tooltips
Hover over any model name to see:
- Full pricing per 1M tokens (input/output/cached)
- Estimated cost for this specific call
- Daily / Weekly / Monthly / Yearly projections
- Model context window and max output info

### 3. CodeLens (Above Each Call)
Cost summary appears above each API call line with:
- Model name + per-call cost + monthly projection
- 💡 Cheaper alternative suggestions for expensive models

### 4. Status Bar
Bottom status bar shows total file cost at a glance:
- Number of LLM calls detected
- Estimated monthly cost
- ⚠️ Budget warning indicator

### 5. Budget Alerts
Set a monthly budget and get notified when your file's estimated costs exceed it.

### 6. Smart Detection
- Extracts `max_tokens` from nearby code for accurate output estimates
- Analyzes prompt/message strings for input token estimation
- Handles date-suffixed model IDs (e.g., `gpt-4o-2024-08-06`)
- Skips comments automatically

---

## Supported Providers & Models (40+)

| Provider | Models |
|----------|--------|
| **OpenAI** | GPT-4o, GPT-4o-mini, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo, o1, o1-mini, o1-pro, o3, o3-mini, o4-mini |
| **Anthropic** | Claude 3 Opus/Sonnet/Haiku, Claude 3.5 Sonnet/Haiku, Claude 4 Sonnet/Opus |
| **Google** | Gemini 2.5 Pro/Flash, Gemini 2.0 Flash, Gemini 1.5 Pro/Flash |
| **Mistral** | Mistral Large/Small/Medium, Codestral, Mistral Nemo |
| **DeepSeek** | DeepSeek V3, DeepSeek R1, DeepSeek Coder |
| **Cohere** | Command R, Command R+ |
| **Groq** | LLaMA 3.1 70B/8B, Mixtral 8x7B |
| **AWS Bedrock** | Amazon Titan Text Express/Premier |

---

## Supported Languages

- Python (`.py`)
- TypeScript (`.ts`)
- JavaScript (`.js`)
- TypeScript React (`.tsx`)
- JavaScript React (`.jsx`)

---

## Configuration

Open VS Code Settings (`Ctrl+,`) and search for `LLM Cost`:

| Setting | Default | Description |
|---------|---------|-------------|
| `llmCost.enabled` | `true` | Enable/disable inline decorations |
| `llmCost.defaultInputTokens` | `500` | Default input tokens per call |
| `llmCost.defaultOutputTokens` | `300` | Default output tokens per call |
| `llmCost.callsPerDay` | `100` | Estimated API calls per day |
| `llmCost.currency` | `USD` | Display currency (USD/EUR/GBP/INR/JPY) |
| `llmCost.monthlyBudget` | `0` | Monthly budget alert threshold ($) |
| `llmCost.showCodeLens` | `true` | Show CodeLens above API calls |
| `llmCost.showStatusBar` | `true` | Show total cost in status bar |
| `llmCost.showHoverDetails` | `true` | Show rich hover tooltips |
| `llmCost.decorationStyle` | `badge` | Style: `badge`, `minimal`, or `detailed` |

---

## Commands

| Command | Description |
|---------|-------------|
| `LLM Cost: Toggle Inline Cost Display` | Enable/disable cost decorations |
| `LLM Cost: Show File Cost Summary` | Show full cost breakdown popup |
| `LLM Cost: Refresh Cost Estimates` | Re-scan current file |
| `LLM Cost: Set Monthly Budget Alert` | Set monthly budget threshold |

---

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for **"LLM Cost Estimator"**
4. Click **Install**

### From VSIX (Manual)
```bash
code --install-extension llm-cost-estimator-1.0.0.vsix
```

### Build From Source
```bash
git clone https://github.com/phantsom/llm-cost-estimator.git
cd llm-cost-estimator
npm install
npm run compile
# Press F5 in VS Code to launch Extension Development Host
```

---

## How It Works

1. **Detect** — Regex patterns scan your code for model name strings (`"gpt-4o"`, `"claude-3-sonnet"`, etc.)
2. **Resolve** — Matches model strings against a pricing database of 40+ models
3. **Estimate** — Calculates cost using detected `max_tokens` + estimated input tokens
4. **Decorate** — Applies color-coded inline decorations, hover tooltips, CodeLens, and status bar
5. **Alert** — Warns you if estimated monthly costs exceed your budget

---

## Why This Exists

As a Generative AI Engineer building production LLM systems, I noticed teams often have **zero visibility** into per-call API costs during development. A single model choice (GPT-4 vs GPT-4o-mini) can mean the difference between **$50/month and $5,000/month**.

This extension makes cost a **first-class citizen** in your development workflow.

---

## Author

**Soham Dahivalkar** — Generative AI Engineer | PHANTSOM

- [LinkedIn](https://www.linkedin.com/in/soham-dahivalkar-82415426a)
- [GitHub](https://github.com/phantsom)
- [PyPI — ai-bridge-kit](https://pypi.org/project/ai-bridge-kit/)
- [Amazon — Published Author](https://www.amazon.in/dp/B0FNDB1HHR)

---

## License

[MIT](LICENSE) — Free for personal and commercial use.

---

<p align="center">
  <strong>Built with 🧠 by PHANTSOM</strong><br>
  <em>"The Invisible Force Behind Intelligent Systems"</em>
</p>
