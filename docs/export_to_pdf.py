#!/usr/bin/env python3
"""
Convert project markdown docs into styled PDF files using headless Chrome.

Usage:
    python export_to_pdf.py
"""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

import markdown


DOCS = [
    "TECHNICAL_DOCUMENTATION.md",
    "BUSINESS_OVERVIEW.md",
]

CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
]

CSS = """
@page {
  size: A4;
  margin: 0.75in;
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  color: #1f2937;
  background: #ffffff;
  font-family: "Segoe UI", Arial, sans-serif;
  line-height: 1.55;
  font-size: 12pt;
}

main {
  max-width: 100%;
}

h1, h2, h3, h4 {
  line-height: 1.25;
  color: #0f172a;
  page-break-after: avoid;
}

h1 {
  font-size: 26pt;
  margin: 0 0 0.35em 0;
}

h2 {
  font-size: 18pt;
  margin-top: 1.4em;
  border-bottom: 1px solid #dbeafe;
  padding-bottom: 0.2em;
}

h3 {
  font-size: 14pt;
  margin-top: 1.1em;
}

p, li, td, th {
  orphans: 3;
  widows: 3;
}

pre, blockquote, table {
  page-break-inside: avoid;
}

code {
  font-family: Consolas, "Courier New", monospace;
  background: #f1f5f9;
  padding: 0.12em 0.3em;
  border-radius: 4px;
  font-size: 0.92em;
}

pre code {
  display: block;
  padding: 0.75em 0.9em;
  overflow-x: auto;
  white-space: pre-wrap;
  border-radius: 8px;
}

blockquote {
  margin: 1em 0;
  padding: 0.1em 1em;
  border-left: 4px solid #93c5fd;
  background: #eff6ff;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
  font-size: 10.8pt;
}

thead {
  background: #f8fafc;
}

th, td {
  border: 1px solid #d1d5db;
  padding: 8px 10px;
  vertical-align: top;
}

hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.4em 0;
}
"""


def find_chrome() -> str:
    for path in CHROME_CANDIDATES:
        if Path(path).exists():
            return path
    for binary in ("chrome", "msedge"):
        detected = shutil.which(binary)
        if detected:
            return detected
    raise FileNotFoundError("Chrome/Edge binary not found.")


def markdown_to_html(md_text: str, title: str) -> str:
    body = markdown.markdown(
        md_text,
        extensions=["extra", "sane_lists", "nl2br"],
        output_format="html5",
    )
    return (
        "<!doctype html>"
        "<html><head>"
        '<meta charset="utf-8" />'
        f"<title>{title}</title>"
        f"<style>{CSS}</style>"
        "</head><body><main>"
        f"{body}"
        "</main></body></html>"
    )


def render_pdf(chrome_bin: str, html_path: Path, pdf_path: Path) -> None:
    user_data_dir = html_path.parent / ".chrome-pdf-profile"
    user_data_dir.mkdir(exist_ok=True)
    cmd = [
        chrome_bin,
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        f"--user-data-dir={user_data_dir}",
        "--print-to-pdf-no-header",
        f"--print-to-pdf={pdf_path}",
        html_path.resolve().as_uri(),
    ]
    completed = subprocess.run(
        cmd,
        check=False,
        capture_output=True,
        text=True,
    )
    if completed.returncode != 0:
        raise RuntimeError(
            f"Chrome PDF render failed for {html_path.name}\n"
            f"STDOUT:\n{completed.stdout}\nSTDERR:\n{completed.stderr}"
        )


def main() -> int:
    docs_dir = Path(__file__).resolve().parent
    chrome_bin = find_chrome()
    print(f"Using browser: {chrome_bin}")

    for md_name in DOCS:
        md_path = docs_dir / md_name
        if not md_path.exists():
            raise FileNotFoundError(f"Missing file: {md_path}")

        title = md_path.stem.replace("_", " ")
        html_path = docs_dir / f"{md_path.stem}.print.html"
        pdf_path = docs_dir / f"{md_path.stem}.pdf"

        md_text = md_path.read_text(encoding="utf-8")
        html = markdown_to_html(md_text, title)
        html_path.write_text(html, encoding="utf-8")

        render_pdf(chrome_bin, html_path, pdf_path)
        print(f"Created: {pdf_path}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
