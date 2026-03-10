# Phase 3: Profile, Stats, and Polish - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Build YouPage with stats display and basic profile (display name, emoji avatar). Overhaul the visual system across all pages — color roles, shadow system, hover states, loading states, and component state consistency. This phase does not add new movie logging or discovery features.

</domain>

<decisions>
## Implementation Decisions

### YouPage layout
- Stats-first: stats are the hero, profile (name + avatar) is secondary below
- Stats displayed as a compact labeled row: `SEEN 47  ·  AVG RATING 3.8★  ·  WATCHLIST 12`
- Not a scorecard/big numbers layout — compact and inline

### Display name
- Shown as text with an EDIT button next to it
- Clicking EDIT reveals an inline input field; save on blur or Enter
- Stored in localStorage (no backend)

### Avatar
- Emoji picker — user selects one emoji as their avatar
- Stored in localStorage alongside display name
- No file upload, no generated initials

### Color system — new four-color palette
- Add a new blue-gray token (muted slate-blue, chosen to complement `--bg-primary: #13121f`) as `--accent-muted` — used for default shadows, secondary borders, inactive/secondary UI
- **Lavender** `#c084fc` — primary interactive: buttons, active nav, active toggle states
- **Pink** `#ff3daa` — emotion and danger: log modal title, DISCARD CHANGES, destructive actions
- **Lime** `#c8f500` — confirmed and ratings: stars, seen indicators, success states
- **Blue-gray** (new) — default shadows, secondary UI chrome

### Shadow system
- `--accent-shadow` currently hardcoded to lavender — change default shadow to blue-gray
- Lavender shadows (`--shadow-sm/md/lg` with lavender offset) reserved for active/selected/focused states only
- Default resting state of all elements uses blue-gray offset shadows

### Hover states
- Movie cards: shadow lift on hover — shadow offset increases (e.g. `--shadow-sm` → `--shadow-md`)
- Consistent across FindPage, SavedPage, SeenPage grids

### Loading states
- Skeleton cards for FindPage grid while TMDB fetch is in flight
- Skeleton matches grid card shape — placeholder boxes with pulse animation
- CSS-only pulse (no animation library)

### Polish scope
- Full pass across ALL pages: FindPage, SavedPage, SeenPage, MovieDetailPage, YouPage
- Hover, active, empty, and loading states made consistent everywhere

### Claude's Discretion
- Exact blue-gray hex value (should complement `--bg-primary: #13121f` and `--bg-surface: #1e1d2e`)
- Skeleton card pulse animation implementation details
- Emoji picker implementation (custom grid or native input approach)
- Exact spacing and sizing of the stats row
- Whether the EDIT button is always visible or appears on hover

</decisions>

<specifics>
## Specific Ideas

- Stats row format: `SEEN 47  ·  AVG RATING 3.8★  ·  WATCHLIST 12` — compact, not scorecard-style big numbers
- Lavender saturation problem traced to `--accent-shadow: #c084fc` — every shadow in the app is lavender. Fixing this one token + adding blue-gray will resolve most of the overuse.
- Emoji picker for avatar — low friction, fun, fits the personal/personality feel of the app

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/pages/YouPage.jsx` — stub, full replacement needed
- `src/index.css` — all design tokens live here; color system overhaul happens here (add `--accent-muted`, update `--accent-shadow`)
- `src/components/LogModal.jsx` — already uses `--accent-lavender` border and button; will need shadow token update
- `src/components/MovieCard.jsx` — needs hover shadow lift added
- `src/App.css` — `.movie-grid`, `.empty-state` global classes; FindPage grid skeletons fit in here or FindPage.module.css

### Established Patterns
- CSS Modules for component-specific styles; global tokens in `index.css`
- Global state in App.jsx only — localStorage keys "watchlist" and "seenList"; add "profile" key for display name + emoji
- No animation libraries — CSS-only for skeleton pulse
- `--accent-shadow` token is the single point of change for shadow color system-wide

### Integration Points
- `App.jsx` — add profile state (displayName, avatarEmoji) read from localStorage "profile" key; pass to YouPage
- `YouPage.jsx` — receives seenList (for stats), watchlist (for watchlist count), displayName, avatarEmoji, onUpdateProfile props
- `index.css` — new `--accent-muted` token; `--accent-shadow` default changed to blue-gray; lavender shadow variant added for active/selected states
- All page files — hover state CSS updates, loading skeleton for FindPage

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-profile-stats-and-polish*
*Context gathered: 2026-03-10*
