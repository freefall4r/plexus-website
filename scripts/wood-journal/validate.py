#!/usr/bin/env python3
"""Validate a Wood Journal article JSON before it is committed/deployed."""
import json
import re
import sys
from pathlib import Path

REQUIRED = ["slug", "date", "title", "title_ar", "image", "summary", "summary_ar", "sections"]
SECTION_KEYS = ["heading", "heading_ar", "body", "body_ar"]


def fail(msg: str) -> None:
    print(f"INVALID: {msg}")
    sys.exit(1)


def main() -> None:
    path = Path(sys.argv[1])
    try:
        art = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        fail(f"not parseable JSON: {e}")

    for k in REQUIRED:
        if k not in art or not art[k]:
            fail(f"missing field {k}")

    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", art["slug"]):
        fail(f"bad slug {art['slug']!r}")
    if path.stem != art["slug"]:
        fail(f"filename {path.stem!r} != slug {art['slug']!r}")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", art["date"]):
        fail(f"bad date {art['date']!r}")

    img = Path(sys.argv[2]) / art["image"].lstrip("/")
    if not art["image"].startswith("/wood-library/") or not img.is_file():
        fail(f"image does not exist: {art['image']}")

    secs = art["sections"]
    if not isinstance(secs, list) or not 3 <= len(secs) <= 10:
        fail(f"sections count {len(secs) if isinstance(secs, list) else 'n/a'}")
    for i, s in enumerate(secs):
        for k in SECTION_KEYS:
            if not isinstance(s.get(k), str) or len(s[k].strip()) < 3:
                fail(f"section {i} missing {k}")

    # Arabic sanity: the Arabic bodies must actually contain Arabic script.
    joined_ar = " ".join(s["body_ar"] for s in secs)
    if not re.search(r"[؀-ۿ]", joined_ar):
        fail("body_ar contains no Arabic script")

    print(f"OK: {art['slug']} ({len(secs)} sections)")


if __name__ == "__main__":
    main()
