# Changelog — LLM Cost Estimator

All notable changes to this extension will be documented in this file.

## [1.0.0] — 2025-05-08

### 🚀 Initial Release — by Soham Dahivalkar (PHANTSOM)

#### Features
- **Inline Cost Decorations** — Color-coded cost badges appear next to every LLM API call
- **Hover Tooltips** — Rich Markdown tooltips with full pricing breakdown, projections, and model details
- **CodeLens** — Cost summary above each API call with cheaper alternative suggestions
- **Status Bar** — Total file cost displayed in VS Code status bar
- **Budget Alerts** — Set a monthly budget and get warned when estimated costs exceed it
- **Multi-Provider Support** — 40+ models across 8 providers:
  - OpenAI (GPT-4o, GPT-4, o1, o3, o4-mini, etc.)
  - Anthropic (Claude 3/3.5/4 Opus, Sonnet, Haiku)
  - Google (Gemini 1.5/2.0/2.5 Pro, Flash)
  - Mistral (Large, Small, Codestral, Nemo)
  - DeepSeek (V3, R1, Coder)
  - Cohere (Command R, R+)
  - Groq (LLaMA 3.1, Mixtral)
  - AWS Bedrock (Amazon Titan)
- **Smart Detection** — Extracts `max_tokens` from nearby code for accurate output estimates
- **Input Token Estimation** — Analyzes nearby prompt/message strings for input cost estimates
- **Multi-Currency** — USD, EUR, GBP, INR, JPY support
- **3 Decoration Styles** — Badge, Minimal, Detailed
- **Language Support** — Python, TypeScript, JavaScript, TSX, JSX
- **Configurable** — All settings customizable via VS Code settings

#### Commands
- `LLM Cost: Toggle Inline Cost Display`
- `LLM Cost: Show File Cost Summary`
- `LLM Cost: Refresh Cost Estimates`
- `LLM Cost: Set Monthly Budget Alert`
