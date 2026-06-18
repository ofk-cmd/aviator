#!/usr/bin/env python3
"""Replace emoji plane logo with mascot image on all prometey-b HTML pages."""
from pathlib import Path
import re

ROOT = Path("/Users/vv/Desktop/ofk-cmd-aviator")
OLD = re.compile(r'<span class="nav__logo" aria-hidden="true">✈</span>')
IMG = '<img class="nav__logo-img" src="{prefix}assets/logo-prometey.webp" alt="Prometey Aviator KZ" width="40" height="40" loading="eager" />'


def asset_prefix(html_path: Path) -> str:
    depth = len(html_path.relative_to(ROOT).parts) - 1
    return "../" * depth if depth else "./"


def main():
    for path in ROOT.rglob("*.html"):
        if path.name.startswith("google"):
            continue
        text = path.read_text(encoding="utf-8")
        prefix = asset_prefix(path)
        new = OLD.sub(IMG.format(prefix=prefix), text)
        if new != text:
            path.write_text(new, encoding="utf-8")
            print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
