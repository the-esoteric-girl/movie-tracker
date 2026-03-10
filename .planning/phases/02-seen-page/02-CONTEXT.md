# Phase 2: Seen Page - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the full SeenPage — grid and list views of logged movies, with direct modal access for editing any log entry. Wire LogModal into SeenPage to complete LOG-06. The page is about personal history: ratings, reviews, what you've watched.

</domain>

<decisions>
## Implementation Decisions

### Tap behavior
- Tapping a movie in grid OR list view opens the LogModal directly, pre-populated with existing rating/review/watched date
- No navigation to MovieDetailPage from the Seen page
- Seen page is about managing your personal log, not browsing TMDB data

### List view content
- Full rows: poster thumbnail + title + personal star rating + review snippet + watched date
- Review snippet should be visible — it's the point of toggling to list mode
- All four pieces of info shown per row (dense, diary-like)

### Grid card display
- Show user's personal star rating instead of TMDB community rating
- seenList entries already store `rating` — use that field on the card
- Poster + title + personal ★ rating (defensive: show nothing or "—" if unrated)

### Empty state
- Inviting tone, not minimal/plain
- Direction: "Every great list starts with one." + nudge toward the Find tab
- Should feel warm and encouraging, not like an error state

### Claude's Discretion
- Exact review snippet truncation length
- Grid/list toggle UI placement and icon style
- Watched date formatting in list rows (e.g. "March 8, 2026" vs "Mar 8")
- Whether unrated entries show empty stars or a dash

</decisions>

<specifics>
## Specific Ideas

- "Your story starts here" vibe was considered but user preferred inviting over wistful
- Empty state should nudge toward Find tab (where discovery happens)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/LogModal.jsx` — already built in Phase 1, accepts `movie`, `initialData`, `onSave`, `onClose`; import directly into SeenPage
- `src/components/MovieCard.jsx` — reusable for grid, but needs personal rating substitution (or a new SeenCard variant)
- `src/pages/SavedPage.jsx` — grid pattern with `.movie-grid` global class; same layout baseline for SeenPage grid view
- `src/App.css` — `.app`, `.heading`, `.movie-grid`, `.empty-state` global classes available

### Established Patterns
- CSS Modules for component-specific styles (SeenPage.module.css)
- Global state in App.jsx only — SeenPage already receives `seenList` + `onRemove` props
- `updateSeen(movieId, fields)` already in App.jsx; needs to be passed to SeenPage as `onUpdateSeen` prop
- Defensive rendering: `value ? value.toFixed(1) : "N/A"`

### Integration Points
- `App.jsx` — add `onUpdateSeen={updateSeen}` to SeenPage route (currently missing)
- `SeenPage.jsx` — currently a stub, full replacement
- LogModal modal visibility state lives in SeenPage (local state), same pattern as MovieDetailPage

</code_context>

<deferred>
## Deferred Ideas

- Reverie reoriented toward recommendations, suggestions, and exploration — user wants the app to evolve from a tracker into a discovery-first experience. Meaningful product pivot, worth revisiting as a future milestone.

</deferred>

---

*Phase: 02-seen-page*
*Context gathered: 2026-03-10*
