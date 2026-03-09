# CLAUDE.md — Reverie Movie Tracker

## What this app does

Reverie is a movie tracker for indecisive watchers. Users can discover movies by mood/genre, save them to a watchlist, and log movies they've seen with ratings and reviews.

## Stack

- React + Vite
- React Router v7
- CSS Modules for component styles
- Global design tokens in src/index.css and layout classes in src/App.css
- TMDB API — key in .env as VITE_TMDB_API_KEY

## File structure

src/
├── constants/
│ └── moods.js — MOODS array, single source of truth
├── components/
│ ├── MovieCard.jsx — grid card, links to detail page
│ ├── SearchBar.jsx — controlled input, stateless
│ ├── MoodSelector.jsx — mood tag buttons, stateless
│ └── BottomNav.jsx — fixed bottom nav, self-contained
├── pages/
│ ├── FindPage.jsx — discover hub, fetches TMDB
│ ├── SavedPage.jsx — renders watchlist from props
│ ├── SeenPage.jsx — stub, needs building
│ ├── MovieDetailPage.jsx — full movie screen
│ └── YouPage.jsx — stub, needs building
├── App.jsx — all routes + global state
└── index.css — all CSS custom properties

## Component props

| Component       | Props                                                         |
| --------------- | ------------------------------------------------------------- |
| MovieCard       | id, title, posterPath, releaseDate, voteAverage               |
| SearchBar       | query, onQueryChange(value)                                   |
| MoodSelector    | activeMood, onMoodSelect(moodObject)                          |
| BottomNav       | none                                                          |
| FindPage        | watchlist, onAdd(movie), onRemove(id)                         |
| SavedPage       | watchlist, onRemove(id)                                       |
| SeenPage        | seenList, onRemove(id)                                        |
| MovieDetailPage | watchlist, seenList, onAdd, onRemove, onAddSeen, onRemoveSeen |
| YouPage         | none                                                          |

## State architecture

- Global state lives in App.jsx only — never in pages
- watchlist and seenList passed down as props
- localStorage keys: "watchlist" and "seenList"
- Full movie objects stored, not just IDs
- loadFromStorage/saveToStorage helpers in App.jsx

## Data fetching patterns

- Raw fetch(), no library
- API key appended as ?api_key=... on every URL
- FindPage: useEffect on [query, activeMood], 500ms debounce
  - query → /search/movie?query=...
  - activeMood → /discover/movie?with_genres=...
  - neither → /movie/popular
- MovieDetailPage: useEffect on [id]
  - /movie/{id}?append_to_response=credits
  - cancelled flag prevents stale state on unmount

## Image URLs

- Posters: https://image.tmdb.org/t/p/w500{poster_path}
- Backdrops: https://image.tmdb.org/t/p/w1280{backdrop_path}
- Cast: https://image.tmdb.org/t/p/w185{profile_path}

## TMDB field → prop mapping

Always camelCase at the call site:

- poster_path → posterPath
- release_date → releaseDate
- vote_average → voteAverage

## Design system

Never hardcode values — always use CSS custom properties.
Key tokens:

- Colors: --bg-primary, --bg-surface, --border-subtle, --border-bold, --text-primary, --text-muted
- Accents: --accent-lavender, --accent-pink, --accent-lime
- Shadows: --shadow-sm, --shadow-md, --shadow-lg
- Typography: --font-display (Unbounded), --font-body (Space Grotesk)
- Spacing: --space-1 through --space-16

## Coding conventions

- Functional components only
- CSS Modules for all component styles
- Named exports for constants, default exports for components
- Defensive rendering: value ? value.toFixed(1) : "N/A"
- Import MOODS from constants/moods.js — never redefine it

## Known issues — do not "fix" without asking

- No error handling on failed TMDB fetches yet — planned
- No quick-add from grid — hover overlay planned
- SavedPage has no inline remove — navigates to detail page for now
- Cast key uses cast_id ?? id — known, low priority

## Do not touch without asking

- Global state architecture in App.jsx
- CSS custom properties in index.css
- MOODS array — src/constants/moods.js only
- Established prop names and TMDB field mapping

## Current status

✅ Working: FindPage, SavedPage, MovieDetailPage, BottomNav, MoodSelector, global state, mood filters wired to TMDB
❌ Stubs: SeenPage, YouPage
🔜 Next: Build SeenPage
