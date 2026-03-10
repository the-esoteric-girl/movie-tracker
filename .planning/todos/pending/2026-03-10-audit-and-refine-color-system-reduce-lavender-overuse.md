---
created: 2026-03-10T08:25:33.788Z
title: Audit and refine color system — reduce lavender overuse
area: ui
files:
  - src/index.css
---

## Problem

The color system currently overuses `--accent-lavender` across too many contexts — interactive elements, highlights, hover states, borders — making the palette feel monotonous. The design intent was a three-accent system (lavender, pink, lime) used purposefully, but in practice lavender dominates. Color usage doesn't feel consistent: some areas use lavender for decoration while others use it for primary interaction cues, muddying the visual hierarchy.

## Solution

Audit every use of `--accent-lavender`, `--accent-pink`, and `--accent-lime` across all components and pages. Establish a clear role for each accent (e.g. lavender = primary actions/links, pink = ratings/emotional cues, lime = confirmed/seen states) and remap usages accordingly. Update `index.css` token comments to document intended usage. May also want to introduce a few semantic tokens (e.g. `--color-action`, `--color-success`) that point to accent vars so usage intent is self-documenting.
