# LLM Cost Tracker by PHANTSOM

## Business & Non-Technical Overview

**Author:** Soham Dahivalkar | PHANTSOM  
**Date:** May 2026

---

## The Problem

Every company using AI (ChatGPT, Claude, Gemini) in their software products pays money **per API call**. These costs add up fast:

| Scenario | Monthly Cost |
|----------|-------------|
| A chatbot answering 1,000 customer queries/day using GPT-4 | **$5,400/month** |
| The same chatbot using GPT-4o-mini instead | **$54/month** |
| **Savings from one model switch** | **$5,346/month** |

**The problem?** Developers writing the code have **zero visibility** into what each AI call costs. They pick a model, write the code, and the finance team gets a shock at the end of the month.

There is no tool that shows the cost **while writing code** — before it hits production.

**Until now.**

---

## The Solution

**LLM Cost Tracker by PHANTSOM** is a tool that plugs into the developer's code editor (VS Code — used by 15+ million developers worldwide) and shows the **estimated cost of every AI API call** in real-time, right next to the code.

### What the Developer Sees:

```
BEFORE (without our tool):
    model="gpt-4"    ← Developer has no idea this costs $0.09 per call

AFTER (with our tool):
    model="gpt-4"    ← 💀 $0.09/call · ~$270/mo [GPT-4] — EXPENSIVE!
    💡 Consider gpt-4o-mini — 97% quality at 3% of the cost
```

The developer **immediately knows**:
- This call costs $0.09
- At 100 calls/day, that's $270/month
- There's a cheaper option that's almost as good

---

## Key Features

### 1. Real-Time Cost Visibility
Every line of code that calls an AI model gets an automatic cost label — **color-coded by expense level**:

| Color | Meaning | Action |
|-------|---------|--------|
| 🟢 **Green** | Very cheap | No worries |
| 🟡 **Yellow** | Moderate | Monitor it |
| 🟠 **Orange** | Expensive | Review the choice |
| 🔴 **Red** | Very expensive | Find alternatives |
| 💀 **Skull** | Dangerously expensive | Immediate attention needed |

### 2. Detailed Cost Breakdown (on hover)
When a developer hovers their mouse over any AI model name, they see:
- Cost per single call
- Daily / Weekly / Monthly / Yearly projections
- Full pricing details from the AI provider
- Context window and model specifications

### 3. Automatic Cheaper Alternative Suggestions
If a developer is using an expensive model, the tool **automatically suggests a cheaper one**:
- "You're using GPT-4 ($30/1M tokens). Consider GPT-4o-mini ($0.15/1M tokens) — **200x cheaper**"
- "You're using Claude 3 Opus ($15/1M). Consider Claude 3 Haiku ($0.25/1M) — **60x cheaper**"

### 4. Monthly Budget Alerts
Teams can set a monthly AI budget. If estimated costs exceed the budget, the tool shows a **warning notification** — **before the code goes to production**.

### 5. Multi-Currency Support
Costs can be displayed in:
- 🇺🇸 USD (US Dollar)
- 🇪🇺 EUR (Euro)
- 🇬🇧 GBP (British Pound)
- 🇮🇳 INR (Indian Rupee)
- 🇯🇵 JPY (Japanese Yen)

### 6. Comprehensive AI Provider Coverage
Supports **40+ models** from **8 major AI providers**:

| Provider | Example Models |
|----------|---------------|
| **OpenAI** | GPT-4o, GPT-4, GPT-3.5, o1, o3, o4-mini |
| **Anthropic** | Claude 3 Opus, Claude 3.5 Sonnet, Claude 4 |
| **Google** | Gemini 2.5 Pro, Gemini 2.0 Flash |
| **Mistral** | Mistral Large, Codestral |
| **DeepSeek** | DeepSeek V3, DeepSeek R1 |
| **Cohere** | Command R, Command R+ |
| **Groq** | LLaMA 3.1, Mixtral |
| **AWS** | Amazon Titan Text |

---

## Who Is This For?

| User | How They Benefit |
|------|-----------------|
| **Software Developers** | See costs before deploying code. Make informed model choices. |
| **Engineering Managers** | Ensure teams stay within AI budgets. Prevent surprise bills. |
| **CTOs / Tech Leads** | Get visibility into AI infrastructure costs at the code level. |
| **Startup Founders** | Control AI spending from Day 1. Every dollar matters. |
| **Freelance AI Developers** | Accurately estimate costs for client projects. |
| **Students / Learners** | Understand the financial impact of different AI models. |

---

## Business Impact

### Cost Savings
| Without This Tool | With This Tool |
|-------------------|----------------|
| Developer picks GPT-4 "because it's the best" | Developer sees GPT-4 costs $270/mo and GPT-4o-mini costs $2.70/mo |
| Nobody notices until the monthly bill arrives | Cost is visible at the moment of writing code |
| Finance team asks "why did AI costs triple?" | Budget alerts trigger before code reaches production |
| **Result: Uncontrolled AI spending** | **Result: Optimized AI spending from Day 1** |

### Real-World Savings Example

A typical AI-powered SaaS product might have:
- 5 AI features
- Each making 500 API calls/day
- Using GPT-4o ($2.50 input / $10.00 output per 1M tokens)

**Without optimization:** ~$450/month  
**After switching 3 features to GPT-4o-mini (suggested by our tool):** ~$85/month  
**Annual savings: $4,380**

For larger companies with dozens of AI features, savings can reach **$50,000-$500,000+ per year**.

---

## Competitive Landscape

| Feature | LLM Cost Tracker by PHANTSOM | Manual Tracking (Spreadsheets) | Cloud Billing Dashboards |
|---------|------------------------------|-------------------------------|-------------------------|
| Shows cost while writing code | ✅ Yes | ❌ No | ❌ No |
| Real-time (updates as you type) | ✅ Yes | ❌ No | ❌ No (delayed by hours/days) |
| Suggests cheaper alternatives | ✅ Yes | ❌ No | ❌ No |
| Supports 40+ models, 8 providers | ✅ Yes | ⚠️ Manual effort | ⚠️ Only their own models |
| Budget alerts before deployment | ✅ Yes | ❌ No | ⚠️ After the fact |
| Free to use | ✅ Yes | ✅ Yes | ✅ Yes |
| No internet/API keys needed | ✅ Yes | N/A | ❌ Requires account |
| Setup time | Instant (1 click install) | Hours | Minutes to Hours |

---

## Market Opportunity

### The AI API Market is Exploding

- **$15+ billion** spent annually on AI API calls globally (2025)
- **15+ million** developers use VS Code (our target platform)
- **Every company** building AI products needs cost control
- **No dominant tool** exists in this space yet

### Target Market Size

| Segment | Size | Our Reach |
|---------|------|-----------|
| VS Code Users | 15M+ developers | Available to all |
| AI/ML Developers | 3M+ globally | Primary audience |
| Companies using AI APIs | 500,000+ | Enterprise potential |
| AI Startups | 50,000+ | Early adopter audience |

---

## Product Specifications

| Specification | Details |
|--------------|---------|
| **Platform** | VS Code (Windows, Mac, Linux) |
| **Installation** | One-click from VS Code Marketplace |
| **Size** | 25 KB (extremely lightweight) |
| **Performance Impact** | Near zero — doesn't slow down the editor |
| **Internet Required** | No — works fully offline |
| **Languages Supported** | Python, TypeScript, JavaScript, React |
| **AI Models Covered** | 40+ models from 8 providers |
| **Price** | Free (MIT License) |
| **Privacy** | No data collected. No telemetry. Everything runs locally. |

---

## Distribution & Availability

| Channel | Status |
|---------|--------|
| **VS Code Marketplace** | ✅ Published — searchable by 15M+ developers |
| **Direct Install** | ✅ Available via .vsix file |
| **Open Source** | ✅ MIT License — free for personal and commercial use |

**Marketplace Link:**
```
https://marketplace.visualstudio.com/items?itemName=sohamdahivalkar.llm-cost-estimator
```

---

## Future Roadmap

| Phase | Feature | Business Impact |
|-------|---------|----------------|
| **Phase 2** | Team dashboard — shared budget tracking | Enterprise sales |
| **Phase 3** | CI/CD integration — block deployments over budget | DevOps pipeline |
| **Phase 4** | Historical cost tracking & analytics | Cost optimization insights |
| **Phase 5** | Support for more languages (Java, Go, Rust, C#) | Wider developer reach |
| **Phase 6** | Live pricing updates (fetch real-time prices) | Always accurate costs |
| **Phase 7** | Custom model pricing (self-hosted models) | Enterprise customization |

---

## About the Creator

**Soham Dahivalkar** — Generative AI Engineer

| Achievement | Details |
|-------------|---------|
| **Current Role** | Generative AI Engineer at Alembic Pharmaceuticals |
| **Published Book** | "Generative AI: High Stakes Cyber Security" (Amazon Kindle) |
| **Research Paper** | "AI in Security: ML Approach for Vulnerability Management" (ResearchGate) |
| **Open Source Library** | ai-bridge-kit (Published on PyPI) |
| **VS Code Extension** | LLM Cost Tracker by PHANTSOM (VS Code Marketplace) |
| **Education** | B.E. Computer Engineering — 9.52 SGPA |
| **Recognition** | State-Level Top 3 Finalist — RTMSU Startup Competition |
| **Certifications** | Microsoft + IIT Bombay (AI/ML), IBM (AI Fundamentals), and 4 more |

**Brand:** PHANTSOM — *"The Invisible Force Behind Intelligent Systems"*

---

## Contact

| Channel | Details |
|---------|---------|
| **Email** | sohamdahivalkar4@gmail.com |
| **LinkedIn** | linkedin.com/in/soham-dahivalkar-82415426a |
| **GitHub** | github.com/phantsom |

---

## Summary

**LLM Cost Tracker by PHANTSOM** solves a simple but critical problem: **developers have no idea how much their AI API calls cost while writing code.** Our tool puts a price tag on every AI call — instantly, visually, and intelligently — with cheaper alternatives suggested automatically.

**One sentence pitch:**
> *"We help developers see AI costs before they become bills."*

---

*Built with purpose by PHANTSOM — Soham Dahivalkar*  
*"The Invisible Force Behind Intelligent Systems"*
