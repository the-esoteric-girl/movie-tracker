# Architecture

**Analysis Date:** 2025-03-09

## Pattern Overview

**Overall:** Component-based SPA with client-side state management and localStorage persistence

**Key Characteristics:**
- Single-page application built with React Router v7
- All state lives in root component (`App.jsx`), passed down as props
- No global state library (Context, Redux, Zustand) — deliberately kept simple
- TMDB API integration via raw fetch() with 500ms debounce
- CSS Modules for component isolation + global design tokens in root CSS

## Layers

**Presentation Layer (Components):**
- Purpose: Render UI elements, handle user interactions, display props
- Location: `src/components/`
- Contains: Stateless functional components (MovieCard, SearchBar, MoodSelector, BottomNav)
- Depends on: Design tokens from `src/index.css`, CSS Module styles
- Used by: Pages

**Page Layer (Route Views):**
- Purpose: Orchestrate page-specific logic, manage local state, fetch data, render components
- Location: `src/pages/`
- Contains: FindPage (search/discover), SavedPage (watchlist display), SeenPage (stub), YouPage (stub), MovieDetailPage (detail view + actions)
- Depends on: Components, localStorage, TMDB API, React Router
- Used by: App.jsx router

**Root/App Layer:**
- Purpose: Global state management, route configuration, state synchronization with localStorage
- Location: `src/App.jsx`
- Contains: watchlist and seenList state, add/remove functions, route definitions
- Depends on: React Router, localStorage
- Used by: All pages receive props from here

**Constants Layer:**
- Purpose: Single source of truth for configuration data
- Location: `src/constants/moods.js`
- Contains: MOODS array mapping mood labels to TMDB genre IDs
- Depends on: Nothing
- Used by: FindPage, MoodSelector

**Design System Layer:**
- Purpose: Visual consistency via CSS custom properties and global styles
- Location: `src/index.css` (tokens), `src/App.css` (global layout classes)
- Contains: Color palette, typography scales, spacing system, shadows, transitions
- Used by: All components via CSS Modules and classes

## Data Flow

**Movie Discovery (FindPage):**

1. User enters search query or selects mood → Updates local query/activeMood state
2. useEffect debounces 500ms, then determines API endpoint:
   - If query: `/search/movie?query=...`
   - Else if mood: `/discover/movie?with_genres=...`
   - Else: `/movie/popular`
3. Fetch returns results, sets movies state
4. MovieCard components render grid, each links to `/movie/{id}`

**Movie Detail & Watchlist Action (MovieDetailPage):**

1. Route param `:id` triggers useEffect
2. Fetch `/movie/{id}?append_to_response=credits` → sets movie + loading state
3. Check if movie is in watchlist/seenList by matching movie.id
4. User clicks "SAVE" or "MARK WATCHED" → Calls onAdd/onRemove/onAddSeen/onRemoveSeen from props
5. Callback updates App.jsx state → Full movie object stored in watchlist/seenList
6. localStorage synced immediately via saveToStorage()

**Watchlist Persistence (App.jsx):**

1. On mount: loadFromStorage("watchlist", []) initializes state
2. On state change: saveToStorage("watchlist", updated) persists
3. Handoff to SavedPage: watchlist passed as prop, displayed via MovieCard grid
4. Remove action from detail page → removeFromWatchlist() → state + localStorage updated

**State Architecture:**
- Watchlist and seenList stored as full TMDB movie objects (not just IDs)
- Parent-to-child only (unidirectional): App.jsx → Pages → Components
- No sibling communication; state changes bubble back to App via callbacks
- localStorage acts as persistent backing store, synced on every state change

## Key Abstractions

**MovieCard Component:**
- Purpose: Reusable grid item representing a single movie
- Examples: `src/components/MovieCard.jsx`
- Pattern: Stateless, receives camelCased props (posterPath, releaseDate, voteAverage), renders Link to detail page
- Defensive rendering: Handles missing data (year → "N/A", rating → "N/A")

**Page Components:**
- Purpose: Route-specific views with local state and side effects
- Examples: `src/pages/FindPage.jsx`, `src/pages/MovieDetailPage.jsx`, `src/pages/SavedPage.jsx`
- Pattern: Receive global state + callbacks from App.jsx, manage local state (query, activeMood, loading), render components
- Query responsibility: FindPage handles discovery; MovieDetailPage handles detail fetching; SavedPage handles display only

**TMDB Field Mapping:**
- Purpose: Normalize API response to camelCase at call site
- Pattern: `poster_path → posterPath`, `release_date → releaseDate`, `vote_average → voteAverage`
- Applied in: FindPage (line 61-68), SavedPage (line 11-18), MovieDetailPage (line 79-88)

**Design Tokens:**
- Purpose: Centralize visual constants to enforce consistency
- Examples: `--accent-lavender`, `--shadow-md`, `--space-4`, `--font-display`
- Usage: All CSS references via `var(--token-name)`; never hardcode colors, spacing, fonts

## Entry Points

**Application Root:**
- Location: `src/main.jsx`
- Triggers: Browser loads `index.html`, script loads main.jsx
- Responsibilities: Bootstrap React app, wrap with BrowserRouter, render App component

**App Component:**
- Location: `src/App.jsx`
- Triggers: BrowserRouter mounts
- Responsibilities: Initialize state from localStorage, define all routes, manage global state mutations, pass props to pages, render BottomNav

**Find Page (Discovery Hub):**
- Location: `src/pages/FindPage.jsx`
- Triggers: Route `/` matched or user clicks Find in BottomNav
- Responsibilities: Fetch movies by search/mood/popular, render grid with MoodSelector and SearchBar

**Movie Detail Page:**
- Location: `src/pages/MovieDetailPage.jsx`
- Triggers: Route `/movie/:id` matched (via MovieCard Link click)
- Responsibilities: Fetch movie details + credits, render hero backdrop + poster + synopsis + cast, handle watchlist/seen toggles

## Error Handling

**Strategy:** Graceful degradation with user feedback

**Patterns:**
- Fetch failures: MovieDetailPage catches with `.catch()`, sets loading=false, shows "Movie not found" fallback (line 33-35)
- Missing data: Defensive rendering with ternary operators (`value ? value.toFixed(1) : "N/A"`) prevents crashes
- localStorage read: Try/catch in loadFromStorage() returns fallback array on parse error (line 12-18)
- API key missing: Error will occur at fetch time; no prevalidation currently (known issue per CLAUDE.md)

**Notable:** No error tracking or user-facing error messages for failed API calls yet (planned per CLAUDE.md)

## Cross-Cutting Concerns

**Logging:** console only; no structured logging or observability

**Validation:**
- Input: SearchBar accepts any text; FindPage trims and checks empty before API call
- TMDB response: No schema validation; trusts API structure

**Authentication:** None — TMDB API key in environment variable, sent with every request

**Image Handling:**
- Poster: `https://image.tmdb.org/t/p/w500{poster_path}` (standard 500px width)
- Backdrop: `https://image.tmdb.org/t/p/w1280{backdrop_path}` (1280px width for detail page)
- Cast: `https://image.tmdb.org/t/p/w185{profile_path}` (185px for cast grid)
- Fallbacks: MovieCard handles missing posterPath implicitly (will 404); MovieDetailPage renders fallback div if backdrop missing (line 102-104)

---

*Architecture analysis: 2025-03-09*
