# External Integrations

**Analysis Date:** 2025-03-09

## APIs & External Services

**The Movie Database (TMDB):**
- Provides movie search, discovery, and detail data
  - SDK/Client: Native `fetch()` only, no SDK imported
  - Auth: API key via `VITE_TMDB_API_KEY` env variable
  - Base URL: `https://api.themoviedb.org/3/`

**TMDB Endpoints Used:**
- `/search/movie` - Text search by query, used in `src/pages/FindPage.jsx`
- `/discover/movie` - Genre-based discovery with mood filtering, used in `src/pages/FindPage.jsx`
- `/movie/popular` - Popular movies default feed, used in `src/pages/FindPage.jsx`
- `/movie/{id}` - Movie detail with credits, used in `src/pages/MovieDetailPage.jsx`
  - Query param: `append_to_response=credits` for cast data

**TMDB Image CDN:**
- Base URL: `https://image.tmdb.org/t/p/`
- Poster images: `w500` size in `src/pages/MovieDetailPage.jsx`, `src/components/MovieCard.jsx`
- Backdrop images: `w1280` size in `src/pages/MovieDetailPage.jsx`
- Cast profile images: `w185` size in `src/pages/MovieDetailPage.jsx`

## Data Storage

**Client-Side Storage:**
- localStorage only, no backend
- Keys used:
  - `"watchlist"` - Array of full TMDB movie objects, managed in `src/App.jsx`
  - `"seenList"` - Array of full TMDB movie objects, managed in `src/App.jsx`
- Serialization: JSON via `JSON.stringify()` and `JSON.parse()`
- Load helpers: `loadFromStorage()` in `src/App.jsx` with error handling
- Save helpers: `saveToStorage()` in `src/App.jsx`

**No Backend Database:**
- No server-side persistence
- No API endpoints

**File Storage:**
- None - all assets served from TMDB CDN

**Caching:**
- Browser HTTP cache only (no explicit cache headers set)
- In-memory state via React hooks: `useState`

## Authentication & Identity

**Auth Provider:**
- None - TMDB API requires only public API key
- No user login system
- No session management

**Implementation:**
- TMDB API key stored in `.env` file as `VITE_TMDB_API_KEY`
- Key appended to every TMDB request as query parameter: `?api_key=${apiKey}`
- Request pattern in `src/pages/FindPage.jsx`:
  ```javascript
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`)
  ```
- Request pattern in `src/pages/MovieDetailPage.jsx`:
  ```javascript
  fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits`)
  ```

## Monitoring & Observability

**Error Tracking:**
- Not integrated - no error monitoring service

**Error Handling:**
- Try-catch in localStorage operations (`src/App.jsx`), returns fallback array on parse error
- Fetch `.catch()` in `MovieDetailPage.jsx` sets `loading: false` on failure
- No error UI display for TMDB API failures (requests silently fail)
- FindPage has no error handling - failed requests leave movies array unchanged

**Logs:**
- None - no logging framework or service

## CI/CD & Deployment

**Hosting:**
- Not specified - any static hosting works (Vercel, Netlify, GitHub Pages, etc.)
- Build output: `dist/` directory after `npm run build`

**CI Pipeline:**
- Not detected - no CI config files (no `.github/workflows`, `.gitlab-ci.yml`, etc.)

## Environment Configuration

**Required env vars:**
- `VITE_TMDB_API_KEY` - The Movie Database API key (get from https://www.themoviedb.org/settings/api)

**Secrets location:**
- `.env` file at project root (present, not committed)
- File ignored by `.gitignore`

**Variable Access Pattern:**
- Vite exposes env vars via `import.meta.env.*`
- Only variables prefixed with `VITE_` are available to client code
- Accessed in `src/pages/FindPage.jsx` line 8 and `src/pages/MovieDetailPage.jsx` line 15

## Webhooks & Callbacks

**Incoming:**
- None - stateless client app, no server endpoints

**Outgoing:**
- None - no external event notifications

## Request Patterns

**FindPage Discovery Flow:**
- Query-based search (500ms debounce):
  ```
  /search/movie?api_key=KEY&query=QUERY
  ```
- Mood-based discovery:
  ```
  /discover/movie?api_key=KEY&with_genres=GENRE_IDS&sort_by=popularity.desc
  ```
- Default popular movies:
  ```
  /movie/popular?api_key=KEY
  ```
- Debounce timeout: 500ms in `src/pages/FindPage.jsx` useEffect

**MovieDetailPage Data Fetch:**
- Single fetch on mount and id change:
  ```
  /movie/{id}?api_key=KEY&append_to_response=credits
  ```
- Stale request prevention: `cancelled` flag in cleanup function prevents state updates after unmount
- Error handling: `.catch()` suppresses errors and sets loading to false

## Data Transformation

**TMDB Field Mapping to React Props:**
- `poster_path` → `posterPath`
- `backdrop_path` → `backdropPath`
- `release_date` → `releaseDate`
- `vote_average` → `voteAverage`
- Applied at fetch site, not in response interceptor

**Defensive Rendering:**
- `voteAverage.toFixed(1)` used in `MovieDetailPage.jsx`
- Null checks for image paths before rendering
- Fallback UI for missing backdrops: empty div with class `backdropFallback`
- Cast missing profile images show "?" placeholder

---

*Integration audit: 2025-03-09*
