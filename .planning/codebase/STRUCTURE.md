# Codebase Structure

**Analysis Date:** 2025-03-09

## Directory Layout

```
movie-tracker/
├── public/                  # Static assets (Vite)
├── src/                     # Application source code
│   ├── assets/              # Image/media assets
│   ├── components/          # Reusable UI components
│   ├── constants/           # Configuration data (MOODS array)
│   ├── pages/               # Route-specific page components
│   ├── App.jsx              # Root component with routes and global state
│   ├── App.css              # Global layout classes and utilities
│   ├── index.css            # Design tokens and CSS custom properties
│   └── main.jsx             # React entry point
├── .planning/               # GSD planning documents
├── .env                     # Environment variables (VITE_TMDB_API_KEY)
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite build configuration
├── eslint.config.js         # Linting rules
└── CLAUDE.md                # Project documentation
```

## Directory Purposes

**src/components/:**
- Purpose: Shared, stateless UI components used across pages
- Contains: Functional components with CSS Module styles
- Key files:
  - `MovieCard.jsx` — Grid card component for displaying a single movie
  - `SearchBar.jsx` — Controlled input for searching films
  - `MoodSelector.jsx` — Mood tag buttons for discovery filtering
  - `BottomNav.jsx` — Fixed navigation bar with route tabs

**src/pages/:**
- Purpose: Route-specific views; each maps to a React Router path
- Contains: Page components, local state management, data fetching
- Key files:
  - `FindPage.jsx` — Discovery hub with search and mood filtering
  - `MovieDetailPage.jsx` — Full movie detail view with hero, synopsis, cast
  - `SavedPage.jsx` — Watchlist display
  - `SeenPage.jsx` — Placeholder for watched movies (stub)
  - `YouPage.jsx` — Placeholder for user profile (stub)

**src/constants/:**
- Purpose: Configuration and lookup tables
- Contains: MOODS array only
- Key files:
  - `moods.js` — Single source of truth for mood-to-genre mapping

**src/assets/:**
- Purpose: Image and media assets
- Contains: Project icons, logos, etc.

**.planning/codebase/:**
- Purpose: GSD analysis documents
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md

## Key File Locations

**Entry Points:**
- `index.html` — HTML template, mounts React to `#root`
- `src/main.jsx` — React DOM render, BrowserRouter setup
- `src/App.jsx` — Application root, route definitions, global state

**Configuration:**
- `.env` — Environment variables (API keys)
- `vite.config.js` — Vite build settings
- `eslint.config.js` — ESLint rules
- `package.json` — Dependencies, dev scripts

**Core Logic:**
- `src/App.jsx` — Global state (watchlist, seenList), localStorage sync, route config
- `src/pages/FindPage.jsx` — TMDB API queries (search, discover, popular), debounce logic
- `src/pages/MovieDetailPage.jsx` — Detailed TMDB fetch with credits, watchlist/seen toggles

**Styling:**
- `src/index.css` — CSS custom properties (colors, spacing, typography, shadows)
- `src/App.css` — Global utility classes (`.app`, `.heading`, `.movie-grid`, `.empty-state`)
- `src/components/*.module.css` — Component-scoped styles (MovieCard.module.css, etc.)
- `src/pages/*.module.css` — Page-scoped styles (MovieDetailPage.module.css, etc.)

**Testing:**
- No test files currently; testing framework not configured

## Naming Conventions

**Files:**
- Components: PascalCase, `.jsx` extension (e.g., `MovieCard.jsx`)
- Pages: PascalCase with "Page" suffix (e.g., `FindPage.jsx`, `MovieDetailPage.jsx`)
- Constants: camelCase, `.js` extension (e.g., `moods.js`)
- Styles: Mirrored to component name with `.module.css` suffix (e.g., `MovieCard.module.css`)
- Global styles: `index.css` (tokens), `App.css` (layout)

**Directories:**
- Lowercase plural (e.g., `components/`, `pages/`, `constants/`)

**CSS Classes:**
- BEM-like for globals: `.heading`, `.movie-grid`, `.empty-state`
- Any naming within Module CSS (scoped automatically)

**React Exports:**
- Named exports for constants: `export const MOODS = [...]`
- Default exports for components: `export default function MovieCard() { ... }`

## Where to Add New Code

**New Feature (e.g., filtering, sorting):**
- Primary logic: `src/pages/FindPage.jsx` (add state, useEffect, API call)
- Components: Add to `src/components/` if reusable, otherwise inline in page
- Constants: Update `src/constants/moods.js` if adding mood/genre data
- Tests: Create `src/pages/__tests__/FindPage.test.jsx` (when testing is configured)

**New Component/Module:**
- Implementation: `src/components/YourComponent.jsx`
- Styles: `src/components/YourComponent.module.css`
- Import in page/parent: Use default export
- Props pattern: Follow MovieCard (destructure, pass camelCased props)

**New Page:**
- Implementation: `src/pages/YourPage.jsx`
- Styles: `src/pages/YourPage.module.css` (or inline if minimal)
- Route: Add `<Route>` to `src/App.jsx` Routes section
- Navigation: Add to BottomNav tabs array in `src/components/BottomNav.jsx` (if needed)
- State: Request state from App.jsx props if global data needed

**Utilities/Helpers:**
- Shared helpers: Could live in `src/utils/` (directory doesn't exist yet; create if needed)
- TMDB field mapping: Applied at call site (FindPage, MovieDetailPage) — no centralized helper yet
- localStorage sync: Already in App.jsx (loadFromStorage, saveToStorage)

**Design Updates:**
- Add new color: `src/index.css` root section
- Add new spacing: `src/index.css` --space-* variables
- Add new font size/weight: `src/index.css` --text-* or --weight-* variables
- Use globally: `var(--token-name)` in any CSS

## Special Directories

**node_modules/:**
- Purpose: Installed dependencies
- Generated: Yes (via npm install)
- Committed: No (.gitignore)

**public/:**
- Purpose: Static assets served as-is by Vite
- Contains: vite.svg and other static files
- Committed: Yes (usually)

**public/:**
- Purpose: Static assets served as-is by Vite
- Contains: vite.svg and other static files
- Committed: Yes

**.git/:**
- Purpose: Git version control metadata
- Generated: Yes (git init)
- Committed: No (.gitignore)

**.env:**
- Purpose: Environment variables (secrets)
- Contains: VITE_TMDB_API_KEY
- Committed: No (.gitignore) — sensitive data
- Note: When adding new env vars, prefix with VITE_ for Vite to expose to client

---

*Structure analysis: 2025-03-09*
