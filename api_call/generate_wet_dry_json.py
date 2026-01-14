#!/usr/bin/env python3
"""
generate_wet_dry_json.py

Input:
  updates.json: a JSON array like:
  [
    {"date":"2026-01-10","text":"...","project_id":"P1"},
    {"date":"2026-01-12","text":"...","project_id":"P2"}
  ]

Output:
  wetlab.json and drylab.json, each shaped like:
  {
    "latest": {"date":"YYYY-MM-DD","summary":"...","projects":["P1"]}
  }

Gemini:
  Calls Gemini twice per update (wet + dry) and returns plain text summaries.
"""

#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

from google import genai
from google.genai import types


# ---- Prompting ----

WET_SYSTEM = """Dry lab —> wet lab 

… 

System Role:

You are the Interdisciplinary Translator for a research laboratory. Translate unstructured notes from a Dry Lab Scientist into a summary for a Wet Lab Life Scientist.

Target Audience Profile:

Recipient has deep expertise in biology/biochemistry/synthetic biology and wet-lab execution (sample handling, reagents, instruments, tacit protocol details). They lack detailed knowledge of bioinformatics pipelines, file formats, sequencing read structures, statistical assumptions, or data-model constraints. 

Strict Adherence Required:

1. Do not invent/infer/guess missing values. If any value (concentration, temperature, duration, kit/version, lot, instrument, sample count, replicate structure, date/time) is missing or unclear, write that in the summary. 
2. Be succinct. Avoid flowery language. Focus on input/output specifications. Avoid narrative. Keep to under 150 words. 
3. For each key parameter/claim, include a short direct excerpt from the source (<15 words) in quotes.

Output Structure: text summary
"""

DRY_SYSTEM = """Wet lab —> dry lab 

… 

System Role:

You are the Interdisciplinary Translator for a research laboratory. Translate unstructured notes from a Wet Lab Scientist into a summary for a Dry Lab Life Scientist.

**Target Audience Profile:**

Recipient is an expert in computational biology; but lacks wet-lab tacit knowledge, reagents, and manual protocol details.

**Strict Adherence Required:**

1. Do not invent/infer/guess missing values. If any value (concentration, temperature, duration, kit/version, lot, instrument, sample count, replicate structure, date/time) is missing or unclear, write that in the summary. 
2. Be succinct. Avoid flowery language. Focus on input/output specifications. Avoid narrative. Keep to under 150 words. 
3. For each key parameter/claim, include a short direct excerpt from the source (<15 words) in quotes.

Output Structure: 

- Text summary
- Define acronyms
- Provide additional context for the dry lab scientist
"""

NO_WET = "No wet-lab work reported this period."
NO_DRY = "No dry-lab work reported this period."


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser()
    p.add_argument("--updates", required=True, help="Path to updates JSON (array).")
    p.add_argument("--wet-out", default="wetlab.json", help="Output path for wetlab.json")
    p.add_argument("--dry-out", default="drylab.json", help="Output path for drylab.json")
    p.add_argument("--model", default="gemini-2.5-flash", help="Gemini model name")
    p.add_argument("--retries", type=int, default=3, help="Retries per Gemini call")
    p.add_argument("--sleep", type=float, default=0.0, help="Sleep seconds between calls")
    p.add_argument("--temperature", type=float, default=0.3, help="Generation temperature")
    return p.parse_args()

def load_json(path: str) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(path: str, data: Any) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def require_updates(payload: Any) -> List[Dict[str, Any]]:
    if not isinstance(payload, list) or not all(isinstance(x, dict) for x in payload):
        raise ValueError("updates.json must be a JSON array of objects.")
    for i, u in enumerate(payload):
        if "date" not in u or "text" not in u or "project_id" not in u:
            raise ValueError(f"Update at index {i} missing required keys: date, text, project_id")
    return payload

def parse_date_yyyy_mm_dd(s: str) -> datetime:
    return datetime.strptime(s, "%Y-%m-%d")

def gemini_text(
    client: genai.Client,
    model: str,
    system_instruction: str,
    text_update: str,
    temperature: float,
    retries: int,
) -> str:
    prompt = f'text:\n"""{text_update}"""'
    last_err: Optional[Exception] = None

    for attempt in range(1, retries + 1):
        try:
            resp = client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=temperature,
                ),
            )
            out = (resp.text or "").strip()
            if not out:
                raise RuntimeError("Empty response from Gemini.")
            return out
        except Exception as e:
            last_err = e
            time.sleep(min(2.0 * attempt, 6.0))

    raise RuntimeError(f"Gemini call failed after {retries} retries: {last_err}")

def pick_latest_relevant(
    updates_sorted: List[Dict[str, Any]],
    summaries: List[str],
    sentinel: str,
) -> Optional[Tuple[Dict[str, Any], str]]:
    for u, s in zip(reversed(updates_sorted), reversed(summaries)):
        if s.strip() != sentinel:
            return (u, s.strip())
    return None

def main() -> int:
    args = parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY is not set.", file=sys.stderr)
        return 2

    client = genai.Client(api_key=api_key)

    updates = require_updates(load_json(args.updates))
    updates_sorted = sorted(updates, key=lambda u: parse_date_yyyy_mm_dd(str(u["date"])))

    wet_summaries: List[str] = []
    dry_summaries: List[str] = []

    for i, u in enumerate(updates_sorted, start=1):
        text_update = str(u.get("text", "")).strip()

        wet = gemini_text(client, args.model, WET_SYSTEM, text_update, args.temperature, args.retries)
        if args.sleep > 0:
            time.sleep(args.sleep)

        dry = gemini_text(client, args.model, DRY_SYSTEM, text_update, args.temperature, args.retries)
        if args.sleep > 0:
            time.sleep(args.sleep)

        wet_summaries.append(wet)
        dry_summaries.append(dry)

        print(f"[{i}/{len(updates_sorted)}] {u['date']} {u['project_id']}")

    latest_wet = pick_latest_relevant(updates_sorted, wet_summaries, NO_WET)
    latest_dry = pick_latest_relevant(updates_sorted, dry_summaries, NO_DRY)

    wet_out: Dict[str, Any] = {
        "latest": {"date": "", "summary": NO_WET, "projects": []}
        if latest_wet is None
        else {"date": latest_wet[0]["date"], "summary": latest_wet[1], "projects": [latest_wet[0]["project_id"]]}
    }
    dry_out: Dict[str, Any] = {
        "latest": {"date": "", "summary": NO_DRY, "projects": []}
        if latest_dry is None
        else {"date": latest_dry[0]["date"], "summary": latest_dry[1], "projects": [latest_dry[0]["project_id"]]}
    }

    save_json(args.wet_out, wet_out)
    save_json(args.dry_out, dry_out)

    print(f"Wrote: {args.wet_out}")
    print(f"Wrote: {args.dry_out}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())