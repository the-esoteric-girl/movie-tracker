---
phase: quick-1
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - src/pages/SeenPage.jsx
  - src/pages/SeenPage.module.css
  - src/components/LogModal.module.css
  - src/index.css
autonomous: true
requirements: [SEEN-POLISH]

must_haves:
  truths:
    - "Grid view cards visually match MovieCard style (border-bold, shadow-md, hover lift)"
    - "User ratings display in lime green, community ratings display in gray"
    - "List view rows use dividers layout with 80px poster, no card boxes"
    - "Grid/list toggle shows SVG icon buttons"
    - "LogModal date label uses Space Grotesk font in muted gray"
    - "App scrollbar is styled (6px, border-subtle thumb, bg-primary track)"
  artifacts:
    - path: "src/pages/SeenPage.jsx"
      provides: "SVG icons, getRating helper, updated grid/list markup"
    - path: "src/pages/SeenPage.module.css"
      provides: "Grid card styles, rating color classes, list divider styles"
    - path: "src/components/LogModal.module.css"
      provides: "Date label font/color fix"
    - path: "src/index.css"
      provides: "Custom scrollbar styles"
  key_links:
    - from: "SeenPage.jsx getRating()"
      to: "SeenPage.module.css gridRatingUser/gridRatingCommunity"
      via: "className conditional on rating source"
      pattern: "getRating"
---

<objective>
Commit SeenPage design polish already applied to the codebase: grid/list view icons, rating color coding, list divider layout, LogModal date fix, and custom scrollbar.

Purpose: Record and atomically commit the visual polish pass so the checkpoint can be verified and the phase completed.
Output: All four modified files committed under a single descriptive commit.
</objective>

<execution_context>
@C:/Users/sophi/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/sophi/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Verify and commit design polish changes</name>
  <files>
    src/pages/SeenPage.jsx
    src/pages/SeenPage.module.css
    src/components/LogModal.module.css
    src/index.css
  </files>
  <action>
    These files have already been modified. Confirm all four files are present with the expected changes, then stage and commit them.

    Expected changes per file:
    - src/pages/SeenPage.jsx: SVG GridIcon/ListIcon components inline, getRating() helper returning user rating (lime) or community rating/2 (gray), grid cards with year+rating meta row matching MovieCard structure, list rows with 80px poster and divider layout
    - src/pages/SeenPage.module.css: Grid card classes use --border-bold and --shadow-md with hover lift transform, rating classes gridRatingUser (--accent-lime) and gridRatingCommunity (--text-muted), list view uses thin dividers (border-bottom on row, no box shadow/border on list card), title allows 3-line clamp
    - src/components/LogModal.module.css: dateLabel uses var(--font-body) (Space Grotesk), dateText color is var(--text-muted)
    - src/index.css: Custom scrollbar rules — ::-webkit-scrollbar width 6px, thumb color var(--border-subtle), track color var(--bg-primary)

    Do NOT modify any file content — changes are already applied. Only read, verify, stage, and commit.

    Commit command:
    git add src/pages/SeenPage.jsx src/pages/SeenPage.module.css src/components/LogModal.module.css src/index.css
    git commit -m "feat(02-seen-page): apply design polish — grid/list icons, rating colors, list dividers, scrollbar, LogModal date fix"
  </action>
  <verify>
    <automated>git show --stat HEAD</automated>
  </verify>
  <done>Commit exists containing all four files with the polish changes. git show --stat HEAD lists SeenPage.jsx, SeenPage.module.css, LogModal.module.css, and index.css.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>SeenPage design polish: grid cards match MovieCard style, user ratings are lime green, community ratings are gray, list view uses dividers, grid/list toggle has SVG icons, LogModal date uses Space Grotesk in muted gray, app scrollbar is slim and dark-themed.</what-built>
  <how-to-verify>
    1. Open http://localhost:5173/seen
    2. Grid view: confirm movie cards have hard offset shadow and lift on hover, matching the style of cards on FindPage
    3. Grid view: confirm entries you have rated show the rating in lime green; entries without a personal rating show the TMDB score (halved) in gray
    4. Click the list icon (top-right toggle): confirm rows switch to divider layout with 80px posters and no card boxes
    5. Click a card to open LogModal: confirm the date field label is in Space Grotesk (not Unbounded) and muted gray
    6. Scroll any page: confirm the scrollbar is 6px wide with a dark track and subtle thumb
  </how-to-verify>
  <resume-signal>Type "approved" if all checks pass, or describe any issues to fix</resume-signal>
</task>

</tasks>

<verification>
git show --stat HEAD confirms the four-file commit.
Visual checkpoint confirms polish is correct in the running app.
</verification>

<success_criteria>
All four files committed in a single atomic commit. Visual checkpoint approved — grid cards match MovieCard style, rating colors are correct, list dividers render, LogModal date is Space Grotesk, scrollbar is styled.
</success_criteria>

<output>
After completion, create `.planning/quick/1-apply-seenpage-design-polish-grid-list-i/1-SUMMARY.md` summarizing what was committed and the checkpoint result.
</output>
