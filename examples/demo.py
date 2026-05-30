"""
LLM Cost Estimator — Demo File
Open this file with the extension installed to see cost decorations!
"""

from openai import OpenAI

client = OpenAI()

# ─── CHEAP CALL ────────────────────────────────────────────
# This should show GREEN decoration
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Say hello!"},
    ],
    max_tokens=100,
)

# ─── MODERATE CALL ─────────────────────────────────────────
# This should show YELLOW decoration
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a senior code reviewer."},
        {"role": "user", "content": "Review this pull request and provide feedback."},
    ],
    max_tokens=2000,
)

# ─── EXPENSIVE CALL ────────────────────────────────────────
# This should show RED decoration
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are an expert analyst."},
        {"role": "user", "content": "Analyze this 50-page financial report."},
    ],
    max_tokens=4000,
)

# ─── ANTHROPIC ─────────────────────────────────────────────
import anthropic

anthropic_client = anthropic.Anthropic()

message = anthropic_client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explain quantum computing in simple terms."},
    ],
)

# ─── CLAUDE HAIKU (CHEAP) ─────────────────────────────────
message = anthropic_client.messages.create(
    model="claude-3-haiku",
    max_tokens=500,
    messages=[
        {"role": "user", "content": "Summarize this text."},
    ],
)

# ─── CLAUDE OPUS (PREMIUM) ─────────────────────────────────
message = anthropic_client.messages.create(
    model="claude-3-opus",
    max_tokens=4096,
    messages=[
        {"role": "user", "content": "Write a comprehensive research paper on AI safety."},
    ],
)

# ─── GOOGLE GEMINI ─────────────────────────────────────────
import google.generativeai as genai

model = genai.GenerativeModel("gemini-1.5-pro")
response = model.generate_content("Write a poem about AI")

flash_model = genai.GenerativeModel("gemini-2.0-flash")
response = flash_model.generate_content("Quick summary please")

# ─── DEEPSEEK ─────────────────────────────────────────────
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[{"role": "user", "content": "Hello!"}],
    max_tokens=200,
)

# ─── REASONING MODEL ──────────────────────────────────────
response = client.chat.completions.create(
    model="o1",
    messages=[{"role": "user", "content": "Solve this math proof step by step."}],
    max_tokens=8000,
)

# ─── MINI REASONING ───────────────────────────────────────
response = client.chat.completions.create(
    model="o4-mini",
    messages=[{"role": "user", "content": "What is 2+2?"}],
    max_tokens=500,
)

print("Done! Check the inline decorations →")
