# Reverie

## What This Is

Reverie is a movie tracker for indecisive watchers. Users discover movies by mood or search, save them to a watchlist, and log movies they've seen with personal ratings and reviews. Everything lives locally — no accounts, no friction.

## Core Value

The moment of logging a movie — rating it, jotting a thought, remembering when you watched it — should feel satisfying and personal.

## Requirements

### Validated

- ✓ User can discover movies by mood/genre — existing (FindPage + TMDB discover)
- ✓ User can search movies by title — existing (FindPage + TMDB search)
- ✓ User can view movie details including cast — existing (MovieDetailPage)
- ✓ User can save movies to a watchlist — existing (App.jsx state + localStorage)
- ✓ User can remove movies from watchlist — existing
- ✓ User can view their watchlist — existing (SavedPage)
- ✓ User can browse popular movies when no search/mood is active — existing

### Active

- [ ] User can mark a movie as seen and rate it (½–5★) via a modal
- [ ] User can write an optional review when logging a movie seen
- [ ] User can record the date they watched a movie (defaults to today)
- [ ] User can edit their rating/review for a movie already in seenList
- [ ] Modal is reusable — triggerable from MovieDetailPage, SeenPage, and other entry points
- [ ] User can view their seen movies in a grid or list view (toggleable)
- [ ] User can view personal stats: total movies seen, average rating, watchlist size
- [ ] User has a basic profile/settings page (YouPage)
- [ ] Visual design system is overhauled — colors, component states, consistent with Figma designs

### Out of Scope

- User accounts / authentication — no backend, localStorage only
- Social features (following, sharing, recommendations from others) — future milestone
- Export or backup of data — deferred
- Mobile app or PWA — web-first for now
- Real-time or collaborative features — out of scope entirely

## Context

- Brownfield: core pages and components already built (FindPage, SavedPage, MovieDetailPage, BottomNav, MoodSelector, MovieCard, SearchBar)
- Stack: React 19 + Vite, React Router v7, CSS Modules, TMDB API, localStorage
- Design aesthetic: brutalist risograph — hard offset box shadows, no border radius, Unbounded + Space Grotesk fonts
- User is actively designing components in Figma; wants visual overhaul to happen as a dedicated phase
- seenList currently stores full TMDB movie objects; will need to extend to include rating, review, watchedDate fields
- No testing framework currently in place

## Constraints

- **Tech stack**: React + Vite, CSS Modules — no additional libraries without discussion
- **State**: Global state stays in App.jsx only; localStorage keys "watchlist" and "seenList"
- **Auth**: None — everything client-side, no backend
- **Design tokens**: Never hardcode values — always CSS custom properties from index.css

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Extend seenList objects with rating/review/watchedDate fields | Keeps architecture simple — no separate ratings store | — Pending |
| Reusable modal component (not page-specific) | Modal triggers from multiple entry points | — Pending |
| Design overhaul as dedicated phase | User has Figma work in progress; better to nail it down before building more UI | — Pending |

---
*Last updated: 2026-03-09 after initialization*
