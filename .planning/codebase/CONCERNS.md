# Codebase Concerns

**Analysis Date:** 2025-02-02

## Tech Debt

**No error handling for TMDB API failures:**
- Issue: FindPage and MovieDetailPage fetch directly from TMDB with no error state or user feedback on network/API failures
- Files: `src/pages/FindPage.jsx` (lines 32-48), `src/pages/MovieDetailPage.jsx` (lines 23-35)
- Impact: Users see blank movie grids or "Movie not found" pages on legitimate API failures (rate limiting, server outages, network errors). No way to distinguish API errors from empty results
- Fix approach: Add error state to components, show error UI with retry button, implement exponential backoff for retries, consider error boundary wrapper

**Duplicate movie additions not prevented:**
- Issue: `addToWatchlist()` and `addToSeen()` in App.jsx never check if a movie already exists in the list before adding
- Files: `src/App.jsx` (lines 32-36, 44-48)
- Impact: Users can add the same movie multiple times to their lists, creating duplicates. Frontend checks with `.some()` exist in MovieDetailPage, but the add functions themselves don't validate
- Fix approach: Add existence check in `addToWatchlist()` and `addToSeen()` before pushing to state, or silently ignore duplicates on the UI layer

**localStorage never validated on load:**
- Issue: `loadFromStorage()` catches JSON parse errors but doesn't validate data structure or content
- Files: `src/App.jsx` (lines 11-18)
- Impact: Corrupted or manually-edited localStorage values could load as invalid movie objects, causing undefined property access and silent failures downstream
- Fix approach: Add schema validation (e.g., check for required TMDB fields like `id`, `title`), sanitize loaded data, provide user option to clear corrupted storage

**No pagination or limits on search results:**
- Issue: FindPage sets all results directly without pagination, and TMDB returns results array that could be large
- Files: `src/pages/FindPage.jsx` (lines 36, 43, 47)
- Impact: Can load hundreds of movies into DOM at once, causing performance degradation. No loading indicator for large result sets. Mobile users see massive lists without navigation
- Fix approach: Implement pagination (load first 20, "Load More" button), virtualization for large lists, or infinite scroll with debounced loading

**Uncontrolled API key exposure risk:**
- Issue: TMDB API key is embedded in environment variable `VITE_TMDB_API_KEY` and used directly in URLs, visible in network tab and potentially in client-side code
- Files: `src/pages/FindPage.jsx` (line 8), `src/pages/MovieDetailPage.jsx` (line 15)
- Impact: Rate limiting against the key is trivial for external users. No proxy or server-side aggregation. API key could be revoked if abuse is detected
- Fix approach: Consider moving TMDB calls through a backend proxy, implement request rate limiting on client, add CORS whitelist to TMDB API key settings

**Missing loading states in SavedPage:**
- Issue: SavedPage renders watchlist directly with no loading or transition state between navigation
- Files: `src/pages/SavedPage.jsx`
- Impact: If watchlist is large or localStorage is slow, component flashes with stale data briefly
- Fix approach: Add loading state, memoize MovieCard list, consider lazy loading watchlist items

## Known Bugs

**FindPage does not reset movies when switching between mood and search:**
- Symptoms: If user searches for "Avatar", then clicks a mood tag, the movies update but search bar still shows "Avatar" text. Clicking a different mood while a mood is already active doesn't update UI instantly
- Files: `src/pages/FindPage.jsx` (lines 13-27, 29-52)
- Trigger: (1) Type search query, then click mood tag. (2) Click mood tag, then click different mood tag
- Workaround: Clear the text field manually or refresh page
- Note: This is a UX confusion more than a functional bug, but state synchronization could be tighter

**MovieCard does not handle missing poster_path gracefully:**
- Symptoms: Image fails to load if posterPath is null/undefined, shows broken image icon
- Files: `src/components/MovieCard.jsx` (line 5)
- Trigger: Movie from TMDB API with no poster_path value
- Workaround: MovieDetailPage handles this with a posterUrl check (line 82-84), but MovieCard does not

**Cast key fallback uses `cast_id ?? id` but both could theoretically collide:**
- Symptoms: If two cast members happen to have the same `id` and the first has no `cast_id`, React may warn about duplicate keys or skip rendering
- Files: `src/pages/MovieDetailPage.jsx` (line 187)
- Trigger: Rare edge case with specific TMDB data
- Workaround: None currently implemented

## Security Considerations

**Unvetted user input in search query:**
- Risk: SearchBar passes user input directly to TMDB API URL via `encodeURIComponent()`. No validation or XSS protection on user input before fetch
- Files: `src/pages/FindPage.jsx` (line 33), `src/components/SearchBar.jsx`
- Current mitigation: `encodeURIComponent()` prevents URL injection, React auto-escapes text content
- Recommendations: Add input length limits (max 100 chars), sanitize special characters, consider rate limiting per-user search (localStorage tracking), add CSP headers in deployment

**No authentication for list data:**
- Risk: watchlist and seenList stored in plain localStorage, accessible by any script on the same origin. No user accounts or encryption
- Files: `src/App.jsx` (loadFromStorage/saveToStorage), all pages reading lists
- Current mitigation: None (by design — this is a local-only app)
- Recommendations: If multi-user features are added, move to server-side storage with auth tokens, encrypt sensitive data at rest

**TMDB API credentials visible in network requests:**
- Risk: API key is sent as URL parameter on every request, visible in browser DevTools Network tab, browser history, CDN logs
- Files: All fetch calls in FindPage.jsx and MovieDetailPage.jsx
- Current mitigation: None
- Recommendations: Move TMDB calls through a backend proxy, use POST instead of GET, implement rate limiting at the API gateway, consider using TMDB SDK for client-side with masked key

**No image source validation:**
- Risk: Poster, backdrop, and cast images are from TMDB's CDN with no validation. Malformed URLs could cause mixed-content warnings in HTTPS context
- Files: `src/components/MovieCard.jsx` (line 5), `src/pages/MovieDetailPage.jsx` (lines 80, 83, 193)
- Current mitigation: All use `https://image.tmdb.org` domain
- Recommendations: Implement image fallback if load fails, validate image URLs before rendering, add onerror handler to img tags

## Performance Bottlenecks

**No debounce/throttle on mood selection:**
- Problem: Clicking mood tags triggers immediate API fetch with no debounce. Rapid clicking causes multiple parallel API requests
- Files: `src/pages/FindPage.jsx` (lines 29-52, 13-20)
- Cause: Debounce is only on search input (line 30), not on mood selection
- Improvement path: Apply debounce to mood state change or cancel pending requests when mood changes again

**No memoization in Movie grid rendering:**
- Problem: FindPage re-renders entire movie grid on every state change, even if the movies array hasn't changed
- Files: `src/pages/FindPage.jsx` (lines 60-69)
- Cause: MovieCard components not memoized, array spread creates new reference every render
- Improvement path: Use `React.memo()` on MovieCard, memoize movies array with `useMemo()`, consider virtualizing list for 100+ items

**All routes re-instantiate on every navigation:**
- Problem: Each page route unmounts and remounts completely, losing any component-level state (like scroll position)
- Files: `src/App.jsx` (Routes), all page components
- Cause: Routes are recreated on every App render
- Improvement path: Use `<Outlet>` pattern with persistent layout, implement scroll restoration with `useEffect`, cache previous search results

**No caching of TMDB responses:**
- Problem: Navigating to a movie detail page and then back to find, then back to the same movie detail triggers a full re-fetch
- Files: `src/pages/MovieDetailPage.jsx` (lines 23-42)
- Cause: No client-side cache, each mount fetches fresh data
- Improvement path: Implement simple Map cache in App.jsx, use React Query or SWR for automatic caching and background revalidation, set reasonable cache TTL (5-30 mins)

**Bottom navigation always rendered:**
- Problem: BottomNav component is rendered at the App level and never unmounts, adding DOM overhead even if not visible
- Files: `src/App.jsx` (line 90)
- Cause: Fixed positioning requires staying in DOM, but could be optimized with CSS or Portal
- Improvement path: Use Portal for fixed nav, lazy load nav menu items, implement scroll detection to hide on scroll

## Fragile Areas

**SeenPage and YouPage are placeholders:**
- Files: `src/pages/SeenPage.jsx`, `src/pages/YouPage.jsx`
- Why fragile: Routes exist but components are non-functional stubs. If navigation is added to these pages (BottomNav buttons), users will see empty placeholders. No error handling or fallback content
- Safe modification: Implement actual components with proper state management, test navigation flow, add error boundaries
- Test coverage: None — no tests exist for any pages

**MovieDetailPage fetch logic has multiple exit points:**
- Files: `src/pages/MovieDetailPage.jsx` (lines 20-42)
- Why fragile: Cleanup function sets `cancelled = true`, but if new id param arrives while fetch is in-flight, the old fetch may complete and check `!cancelled`, causing stale state. useEffect dependency on `[id, apiKey]` is correct, but error handling is minimal
- Safe modification: Add explicit error state and error UI, implement AbortController instead of cancelled flag, test with intentional API failures
- Test coverage: None

**FindPage debounce timer cleanup is correct but timing is critical:**
- Files: `src/pages/FindPage.jsx` (lines 29-52)
- Why fragile: If dependency array changes from `[query, activeMood]`, debounce breaks. Cleanup function is called correctly but relies on clear understanding of React effect lifecycle
- Safe modification: Add comments explaining the debounce pattern, consider extracting to custom hook, test rapid state changes
- Test coverage: None

**App.jsx state is the single source of truth — no redundancy:**
- Files: `src/App.jsx` (lines 24-54)
- Why fragile: watchlist and seenList are only managed in App.jsx. If App component crashes or state is lost, all list data is lost (only recoverable from localStorage). No undo/redo, no change history
- Safe modification: Add data validation before setState, implement error boundary around App, add localStorage backup on state change, consider adding change log
- Test coverage: None

## Scaling Limits

**localStorage size limit:**
- Current capacity: Browser localStorage typically 5-10MB per origin
- Limit: With full TMDB movie objects (JSON stringified), approximately 5000-10000 movies before hitting quota
- Scaling path: Implement IndexedDB for larger storage, or compress movie objects before storing, move to server-side database, implement pagination with lazy-loading from backend

**No pagination means unbounded results:**
- Current capacity: FindPage can load entire TMDB result set into memory
- Limit: 100+ movies in grid causes noticeable lag on older devices. Memory usage grows with each search
- Scaling path: Implement cursor-based pagination with "Load More", use infinite scroll with virtualization, implement server-side search aggregation

**No database for user data:**
- Current capacity: Single-user, single-device only. No sync across devices
- Limit: No way to share watchlists, no account system, watchlist tied to browser storage
- Scaling path: Add authentication layer, move to backend database (PostgreSQL/MongoDB), implement real-time sync, add sharing/collaboration features

## Dependencies at Risk

**React Router v7.13.1 — relatively new major version:**
- Risk: v7 was a major release. May have breaking changes in future patches, fewer community examples and Stack Overflow answers available
- Impact: If a bug is found in router, may need to downgrade or wait for patch, unclear upgrade path to future versions
- Migration plan: Lock version in package-lock.json, monitor release notes for patches, test routes thoroughly on upgrade, consider v6 LTS for stability if needed

**No testing framework installed:**
- Risk: Zero test coverage. Code changes are untested. No regression detection
- Impact: Refactoring is risky. API changes could break silently. New features could introduce bugs without detection
- Migration plan: Add Vitest or Jest, write tests for critical paths (API fetching, state management, routing), aim for 60%+ coverage

**No build output optimization:**
- Risk: Vite dev server is fast but production build is not optimized (no code splitting, no lazy loading, no tree-shaking verification)
- Impact: Bundle size is unknown. Single bundle file could be large on slow networks
- Migration plan: Add build analyzer, implement route-based code splitting with React.lazy(), enable minification verification, add bundle size CI check

**No error boundary implemented:**
- Risk: Single error in any component crashes entire app with white screen
- Impact: Users can't recover without page refresh. No error logging for debugging
- Migration plan: Add React Error Boundary wrapper, log errors to monitoring service, provide fallback UI with "Try Again" button

## Missing Critical Features

**No error recovery UI:**
- Problem: TMDB API failures, network timeouts, and invalid responses all result in blank or "Movie not found" screens with no explanation
- Blocks: Users can't distinguish between "no movies found" and "API is down", can't retry searches, experience frustration

**No results sorting or filtering:**
- Problem: FindPage returns results but can't sort by rating, date, popularity, or filter by genres
- Blocks: Users can't refine large result sets, can't find highest-rated movies in a mood category

**No advanced search:**
- Problem: Can only search by title or mood, no year range, actor, director, runtime filters
- Blocks: Users can't find specific movies by metadata, discovery is limited

**No watch history or ratings:**
- Problem: SeenPage is a stub. Users can't log when they watched a movie, add ratings, or write reviews
- Blocks: Can't track watch history, no review functionality planned

**No social or sharing features:**
- Problem: Lists are local-only, can't share watchlist with friends or sync across devices
- Blocks: App is single-user only, no collaboration features

## Test Coverage Gaps

**No tests for any component or page:**
- What's not tested: All routes, state management, API fetching, data transformations, error handling, localStorage persistence
- Files: All files in `src/`
- Risk: High — refactoring, bug fixes, and new features are unverified. Could introduce regressions silently
- Priority: High — should be addressed before adding major features like SeenPage or YouPage

**No integration tests for full user flows:**
- What's not tested: (1) Search → Detail → Add to watchlist → Back to saved (2) Mood selection → Detail → Mark as seen (3) localStorage persistence across navigation
- Risk: High — user workflows could be broken without detection
- Priority: High

**No API response mocking:**
- What's not tested: Behavior with invalid TMDB responses, missing fields, network errors, rate limiting, slow responses
- Risk: Medium — error handling is untested, app behavior on failures is unknown
- Priority: Medium — add before deploying to production

**No accessibility tests:**
- What's not tested: Keyboard navigation, screen reader compatibility, contrast ratios, focus management, ARIA labels
- Risk: Medium — app may not be usable for users with disabilities
- Priority: Low-Medium — review after UI is more feature-complete

---

*Concerns audit: 2025-02-02*
