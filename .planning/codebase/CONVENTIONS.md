# Coding Conventions

**Analysis Date:** 2026-03-09

## Naming Patterns

**Files:**
- Components: PascalCase with `.jsx` extension: `MovieCard.jsx`, `SearchBar.jsx`, `BottomNav.jsx`
- Page components: PascalCase with `.jsx` extension: `FindPage.jsx`, `MovieDetailPage.jsx`, `SavedPage.jsx`
- CSS Modules: lowercase with `.module.css` extension: `MovieCard.module.css`, `SearchBar.module.css`
- Constants/utilities: lowercase with `.js` extension: `moods.js`
- All in lowercase directories: `src/components/`, `src/pages/`, `src/constants/`

**Functions:**
- Component functions: PascalCase (same as filename): `export default function MovieCard()`
- Handler functions: camelCase with `handle` prefix: `handleMoodSelect`, `handleQueryChange`, `toggleWatchlist`
- Utility functions: camelCase: `loadFromStorage`, `saveToStorage`, `encodeURIComponent`
- Arrow callbacks: camelCase: `onQueryChange`, `onMoodSelect`, `onRemove`, `onAdd`

**Variables:**
- State variables: camelCase: `query`, `activeMood`, `movies`, `watchlist`, `seenList`
- Constants: UPPERCASE_SNAKE_CASE (for module-level): `MOODS` in `src/constants/moods.js`
- Object keys: camelCase or snake_case depending on origin (TMDB API returns snake_case: `poster_path`, `release_date`, `vote_average`)
- Prop transformations: Convert API snake_case to camelCase at call site: `posterPath`, `releaseDate`, `voteAverage`

**Types:**
- No explicit TypeScript types used in codebase, but prop naming follows React conventions

## Code Style

**Formatting:**
- ESLint configured via `eslint.config.js`
- No Prettier config in project
- Target: ES2020 (`ecmaVersion: 2020` in eslint config)
- Quote style: Double quotes (`"` not `'`)
- Indentation: 2 spaces (observed in all files)

**Linting:**
- Tool: ESLint v9.39.1
- Configuration: `eslint.config.js` (flat config format)
- Extends: `@eslint/js` recommended config
- React plugins: `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`
- Rule customization:
  - `no-unused-vars`: Error, but ignores uppercase/underscore prefixed (varsIgnorePattern: `^[A-Z_]`)
  - Flat config with separate files array for `**/*.{js,jsx}`
  - Browser globals enabled

## Import Organization

**Order:**
1. React imports: `import { useState, useEffect } from "react"`
2. Router imports: `import { Routes, Route } from "react-router-dom"`
3. Page/Component imports: Local relative paths
4. Constant imports: `import { MOODS } from "../constants/moods"`
5. Style imports: CSS Modules last: `import styles from "./MovieCard.module.css"`

**Path Aliases:**
- No path aliases configured
- Relative imports used throughout: `import MovieCard from "../components/MovieCard"`
- Root imports for constants: `import { MOODS } from "../constants/moods"` (from pages)

**Export Patterns:**
- Named exports for constants: `export const MOODS = [...]`
- Default exports for components: `export default function MovieCard() { ... }`
- All components are default exports

## Error Handling

**Patterns:**
- Fetch errors: `.catch()` silently handled (no error UI): `MovieDetailPage.jsx` line 33-35
  ```javascript
  .catch(() => {
    if (!cancelled) setLoading(false);
  });
  ```
- Defensive rendering with null coalescing and ternary operators:
  ```javascript
  const year = releaseDate ? releaseDate.slice(0, 4) : "N/A";
  const rating = voteAverage ? voteAverage.toFixed(1) : "N/A";
  ```
- Optional chaining for nested data: `movie.credits?.cast?.slice(0, 14) || []`
- Fallback for undefined arrays: Use `|| []` pattern

**localStorage:**
- Try-catch wrapper for JSON parse: `App.jsx` lines 11-17
  ```javascript
  function loadFromStorage(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  }
  ```

## Logging

**Framework:** `console` (browser console)

**Patterns:**
- No logging statements found in codebase
- Comments used instead: `// defensive coding. some movies have no release date. ? : if/else` in `MovieCard.jsx`
- Development approach: Direct browser console for debugging expected

## Comments

**When to Comment:**
- Explain defensive coding patterns: `MovieCard.jsx` line 6 explains null-coalescing pattern
- Explain non-obvious logic: `MovieDetailPage.jsx` lines 93-113 have section comments for layout structure
- Explain render logic: `MovieDetailPage.jsx` line 100 `aria-hidden="true"` explained via comment placement

**JSDoc/TSDoc:**
- Not used in this codebase
- Function documentation relies on clear naming and parameter passing

## Function Design

**Size:**
- Small, focused functions preferred
- Handlers are typically 2-5 lines
- No large utility functions

**Parameters:**
- Destructure object parameters: `export default function MovieCard({ id, title, posterPath, releaseDate, voteAverage })`
- Single value parameters for simple callbacks: `(e) => onQueryChange(e.target.value)`
- Props destructured in function signature

**Return Values:**
- Components return JSX (implicit return not used)
- Utility functions return primitives or objects
- Handlers return void (side-effects only)
- Conditional rendering uses ternary: `movie ? <div>...</div> : null`

## Module Design

**Exports:**
- Default export for each component file
- One component per file (no compound exports)
- Constants exported as named exports: `export const MOODS = [...]`

**Barrel Files:**
- Not used in this project
- Direct relative imports preferred: `import MovieCard from "../components/MovieCard"`

## CSS & Styling

**Module CSS Pattern:**
- Each component has matching `.module.css`: `MovieCard.jsx` → `MovieCard.module.css`
- Import as object: `import styles from "./MovieCard.module.css"`
- Apply via className: `className={styles.className}`
- Conditional classes with template literals:
  ```javascript
  className={`${styles.tag} ${activeMood === mood.label ? styles.active : ""}`}
  ```

**Design Tokens:**
- All color/spacing values use CSS custom properties from `src/index.css`
- Never hardcode values
- Example usage: `color: var(--text-primary)`, `padding: var(--space-4)`

**CSS Naming Convention:**
- camelCase for class names in modules: `.cardLink`, `.posterWrap`, `.castPhotoEmpty`
- Component structural classes: `.card`, `.poster`, `.info`, `.title`, `.meta`
- State classes: `.active`, `.added`, `.btnWatchedActive`, `.btnSavedActive`

## API Integration Patterns

**TMDB API:**
- API key from environment: `const apiKey = import.meta.env.VITE_TMDB_API_KEY;`
- Query string construction: `api_key=${apiKey}` appended to every URL
- URL encoding for search: `encodeURIComponent(query)` for user input
- Image URLs constructed inline: `https://image.tmdb.org/t/p/w500${posterPath}`
- Debouncing with setTimeout: `FindPage.jsx` line 30-51 (500ms delay)
- Stale request prevention: `cancelled` flag in `MovieDetailPage.jsx` lines 21, 28, 34, 37-38

## State Management Patterns

**App.jsx State:**
- Global state only: `watchlist` and `seenList` as top-level useState
- Initialize from localStorage with lazy initialization: `useState(() => loadFromStorage(...))`
- Update pattern: create new array, setters, then saveToStorage
- Pages receive state via props, not context
- Handlers passed down for mutations

**Page State:**
- `FindPage`: Manages `query`, `activeMood`, `movies` (temporary search results)
- `MovieDetailPage`: Manages `movie` (fetched details) and `loading` state
- Other pages: Stateless, receive props from App

---

*Convention analysis: 2026-03-09*
