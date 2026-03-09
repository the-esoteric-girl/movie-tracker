# Phase 1: Movie Logging - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the LogModal component and extend the seenList data model to store rating, review, and watched date. Users can log a movie from MovieDetailPage, and re-open the modal to edit an existing entry. The modal is reusable — triggerable from MovieDetailPage now, and SeenPage in Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Modal appearance
- Title: "I WATCHED..." — `--accent-pink`, Unbounded font, uppercase. Same title for both add and edit modes.
- Movie row below title: small poster thumbnail + movie title (bold uppercase) + release year (muted)
- Modal has a lavender border (`--accent-lavender`). No X button.
- Buttons at bottom: CANCEL (plain text, left) + LOG IT (`--accent-lavender` filled button, right)

### Star rating
- 5 stars rendered in `--accent-lime`
- Half-star interaction: clicking left half of a star = .5, right half = full star (Letterboxd-style)
- Hover previews the rating before click confirms
- Numeric display "3.5/5" shown in `--accent-lime` to the right of the stars
- Half-fill visual: 4th star with left half filled = 3.5★

### Watch date
- "DATE" label (bold uppercase) + formatted date text (e.g. "Sunday, March 8, 2026")
- Clicking the formatted date text opens a native `<input type="date">` picker
- Defaults to today's date when modal opens for a new entry
- Pre-filled with existing date when editing

### Review field
- Large multi-line textarea
- Placeholder: "My honest thoughts..."
- Dark surface background (`--bg-surface`)
- Optional — user can save without writing anything

### Cancel / dirty state
- If user has made any change (rating, date, or review text modified), CANCEL label changes to "DISCARD CHANGES" in `--accent-pink`
- If no changes (modal opened but nothing touched), CANCEL stays as plain "CANCEL"
- Clicking backdrop or pressing Escape follows the same CANCEL/DISCARD behavior

### Detail page button states
- Unlogged: "LOG IT" — opens modal in add mode
- Already logged: "✓ LOGGED" — opens modal in edit mode, pre-populated with existing data

### Edit mode
- Modal opens pre-populated with existing rating, review, and watched date
- Saving overwrites the existing entry in seenList
- Modal title stays "I WATCHED..." (no separate "edit" title)

### Claude's Discretion
- Where modal visibility state lives (local page state vs App.jsx) — choose whatever is cleanest given reusability requirement
- Whether rating is required to save or can be omitted (0 = unrated)
- Exact dirty-state detection logic (shallow compare initial vs current values)
- Loading/saving feedback (if any)

</decisions>

<specifics>
## Specific Ideas

- Figma reference shared: modal has a lavender rectangular border, pink title "I WATCHED...", lime stars, lavender LOG IT button, plain text CANCEL — brutalist aesthetic, consistent with existing design system
- "DISCARD CHANGES" in `--accent-pink` when dirty — color change on the word signals danger without extra UI
- Half-fill star visual confirmed in Figma: 4th star shows left half filled, right half outline at 3.5★

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/pages/MovieDetailPage.jsx`: `isInSeen` flag (line 47) and `toggleSeen()` (line 54–57) — toggleSeen will be replaced with a modal open trigger
- `src/App.jsx`: `addToSeen(movie)` — needs to accept enriched object `{...movie, rating, review, watchedDate}`; new `updateSeen(movieId, fields)` function needed for edits
- `src/index.css`: `--accent-pink`, `--accent-lime`, `--accent-lavender`, `--bg-surface`, `--font-display`, `--font-body`, `--shadow-md/lg` — all available

### Established Patterns
- CSS Modules for all component styles (LogModal.jsx + LogModal.module.css)
- Default exports for components, named exports for constants
- Global state in App.jsx only — modal data (rating, review, watchedDate) flows up via callback props
- Defensive rendering: `value ? value.toFixed(1) : "N/A"`

### Integration Points
- `MovieDetailPage.jsx:54–57` — toggleSeen() replaced with openLogModal(); LOG IT / ✓ LOGGED button replaces MARK WATCHED / ✓ WATCHED
- `App.jsx` — addToSeen() signature changes; new updateSeen() handler added; both passed as props to MovieDetailPage
- `SeenPage.jsx` — will need LogModal wired in Phase 2 (LOG-06 partial: modal exists after Phase 1, SeenPage wiring is Phase 2)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-movie-logging*
*Context gathered: 2026-03-09*
