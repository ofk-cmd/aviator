#!/usr/bin/env python3
"""Apply prometey v2 light template, bump assets, fix brand partner IDs, SEO dates."""
from __future__ import annotations

import re
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOMAIN = "https://prometey-b.kz"
ASSET_V = "20260618v2"
TODAY = "2026-06-18"

BRAND_DIRS = {
    "pin-up-aviator": "pin-up",
    "1win-aviator": "1win",
    "olymp-aviator": "olymp",
    "mostbet-aviator": "mostbet",
    "1xbet-aviator": "1xbet",
    "parimatch-aviator": "parimatch",
    "melbet-aviator": "melbet",
    "betwinner-aviator": "betwinner",
    "leon-aviator": "leon",
    "vavada-aviator": "vavada",
}


def depth_prefix(rel: str) -> str:
    parts = [p for p in rel.split("/") if p and p != "index.html"]
    return "../" * len(parts) if parts else ""


def patch_html(path: Path) -> list[str]:
    rel = str(path.relative_to(ROOT))
    text = path.read_text(encoding="utf-8")
    orig = text
    changes: list[str] = []
    prefix = depth_prefix(rel)

    # Template v2 stylesheet
    if "prometey-v2.css" not in text:
        text = text.replace(
            f'href="{prefix}css/prometey-aviator.css?v=',
            f'href="{prefix}css/prometey-aviator.css?v=',
        )
        text = re.sub(
            rf'(<link rel="stylesheet" href="{re.escape(prefix)}css/prometey-aviator\.css\?v=[^"]+" />\n)',
            rf'\1  <link rel="stylesheet" href="{prefix}css/prometey-v2.css?v={ASSET_V}" />\n',
            text,
            count=1,
        )
        changes.append("v2-css")

    # Asset versions
    text = re.sub(r"\?v=20260615x", f"?v={ASSET_V}", text)
    text = re.sub(r"\?v=20260618[a-z0-9]*", f"?v={ASSET_V}", text)

    # Light theme-color
    text = re.sub(
        r'<meta name="theme-color" content="#0b0e1a" />',
        '<meta name="theme-color" content="#f4f6fa" />',
        text,
    )

    # Template marker
    if 'data-template="v2"' not in text:
        text = text.replace(
            '<html lang="',
            '<html data-template="v2" lang="',
            1,
        )
        changes.append("data-template")

    # dateModified
    text = re.sub(r'"dateModified": "2026-06-\d{2}"', f'"dateModified": "{TODAY}"', text)

    # Brand page: fix header/mobile CTA to page brand (not always pin-up)
    brand_key = None
    for slug, pid in BRAND_DIRS.items():
        if f"/{slug}/" in f"/{rel}" or rel.startswith(f"{slug}/") or rel.startswith(f"kk/{slug}/"):
            brand_key = pid
            break
    if brand_key:
        text = re.sub(
            r'(<button[^>]*class="[^"]*nav__cta[^"]*js-go-partner[^"]*"[^>]*)data-partner-id="[^"]*"',
            rf'\g<1>data-partner-id="{brand_key}"',
            text,
        )
        text = re.sub(
            r'(<nav id="nav-mobile"[^>]*>[\s\S]*?<button[^>]*class="[^"]*btn--block[^"]*js-go-partner[^"]*"[^>]*)data-partner-id="[^"]*"',
            rf'\g<1>data-partner-id="{brand_key}"',
            text,
            count=1,
        )
        text = re.sub(
            r'(<div class="block-cta block-cta--landing"><button[^>]*data-partner-id=")[^"]*(")',
            rf'\g<1>{brand_key}\2',
            text,
            count=1,
        )
        changes.append(f"partner-id={brand_key}")

    if text != orig:
        path.write_text(text, encoding="utf-8")
    return changes


def update_sitemap():
    sm = ROOT / "sitemap.xml"
    if not sm.exists():
        return
    text = sm.read_text(encoding="utf-8")
    if "<lastmod>" not in text:
        lines = []
        for line in text.splitlines():
            lines.append(line)
            if line.strip().startswith("<loc>") and "<lastmod>" not in text:
                pass
        # rebuild with lastmod
    urls = re.findall(r"<loc>([^<]+)</loc>", text)
    if not urls:
        return
    entries = []
    for loc in urls:
        rel = loc.replace(DOMAIN + "/", "").rstrip("/")
        if not rel:
            fp = ROOT / "index.html"
        elif rel == "kk":
            fp = ROOT / "kk" / "index.html"
        else:
            fp = ROOT / rel / "index.html"
        lm = TODAY
        if fp.exists():
            lm = datetime.fromtimestamp(fp.stat().st_mtime).strftime("%Y-%m-%d")
        pri = "1.0" if rel in ("", "kk") else "0.8"
        if "politika" in rel or "usloviya" in rel or "otvetstvennaya" in rel:
            pri = "0.3"
        entries.append((loc, pri, lm))
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc, pri, lm in entries:
        lines.append(f"  <url><loc>{loc}</loc><lastmod>{lm}</lastmod><priority>{pri}</priority></url>")
    lines.append("</urlset>")
    sm.write_text("\n".join(lines) + "\n", encoding="utf-8")


def word_count(path: Path) -> int:
    html = path.read_text(encoding="utf-8", errors="ignore")
    html = re.sub(r"<script.*?</script>", "", html, flags=re.S | re.I)
    html = re.sub(r"<[^>]+>", " ", html)
    return len(html.split())


def main():
    updated = 0
    under = []
    for html in sorted(ROOT.rglob("index.html")):
        if "assets" in str(html):
            continue
        ch = patch_html(html)
        if ch:
            updated += 1
        rel = str(html.relative_to(ROOT))
        for slug in BRAND_DIRS:
            if slug in rel:
                w = word_count(html)
                if w < 2500:
                    under.append((w, rel))
                break
    update_sitemap()
    print(f"Patched {updated} HTML files, asset v={ASSET_V}")
    if under:
        print("UNDER 2500 words:")
        for w, r in under:
            print(f"  {w} {r}")
    else:
        print("Brand reviews: all >= 2500 words")


if __name__ == "__main__":
    main()
