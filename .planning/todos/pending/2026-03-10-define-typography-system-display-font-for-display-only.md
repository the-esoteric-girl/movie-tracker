---
created: 2026-03-10T08:27:11.932Z
title: Define typography system — display font for display only
area: ui
files:
  - src/index.css
---

## Problem

The display font (`--font-display`, Unbounded) is bleeding into contexts where it shouldn't be used — UI labels, body text, metadata, etc. It's intended as a high-impact display face (page titles, hero headings, section headers) but inconsistent usage dilutes its effect and makes the UI feel noisier. There's no documented rule for when to use `--font-display` vs `--font-body`, so the boundary keeps eroding.

## Solution

Audit all font-family usages across components and pages. Establish a clear rule: `--font-display` (Unbounded) is only for top-level page titles and major section headings — nothing else. `--font-body` (Space Grotesk) handles everything else including card titles, labels, nav items, and metadata. Document the rule in `index.css` as a comment near the font token definitions. Update any misapplied usages found during the audit.
