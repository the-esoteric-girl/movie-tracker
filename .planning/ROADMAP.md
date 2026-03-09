# Roadmap: Reverie

## Overview

Reverie's core value is the movie logging moment — rating, reviewing, remembering. This roadmap builds outward from that moment: first the logging modal and seenList data model, then the full seen movies page, then the profile/stats page and a visual overhaul that makes the whole app feel intentional.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Movie Logging** - Build the log modal and extend seenList to store rating, review, and date (completed 2026-03-09)
- [ ] **Phase 2: Seen Page** - Build the full SeenPage with grid/list toggle and modal re-entry
- [ ] **Phase 3: Profile, Stats, and Polish** - Build YouPage with stats, basic profile, and visual overhaul

## Phase Details

### Phase 1: Movie Logging
**Goal**: Users can log a movie they've seen with a rating, optional review, and watch date — and edit that log later
**Depends on**: Nothing (brownfield foundation already exists)
**Requirements**: LOG-01, LOG-02, LOG-03, LOG-04, LOG-05
**Success Criteria** (what must be TRUE):
  1. User can open a log modal from the movie detail page and mark a movie as seen
  2. User can select a half-star rating (0.5–5 stars) in the modal before saving
  3. User can write an optional text review in the modal
  4. User can set or change the watched date (defaults to today)
  5. User can re-open the modal for an already-logged movie and update their rating or review
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Build LogModal component and extend App.jsx state for enriched seen entries
- [ ] 01-02-PLAN.md — Wire LogModal into MovieDetailPage with LOG IT / ✓ LOGGED button states and edit flow

### Phase 2: Seen Page
**Goal**: Users can browse all their logged movies and jump into editing any log entry
**Depends on**: Phase 1
**Requirements**: SEEN-01, SEEN-02, SEEN-03, LOG-06
**Success Criteria** (what must be TRUE):
  1. User can view all logged movies in a grid layout on the Seen page
  2. User can toggle to a list view that shows each movie's star rating and review snippet
  3. User can tap a movie in the seen list to open the log modal and edit it
  4. Log modal is triggerable from both MovieDetailPage and SeenPage (completes LOG-06)
**Plans**: TBD

Plans:
- [ ] 02-01: Build SeenPage with grid view and list view toggle
- [ ] 02-02: Wire LogModal trigger from SeenPage entries (completes LOG-06)

### Phase 3: Profile, Stats, and Polish
**Goal**: Users have a personal profile page with stats and the whole app looks intentional and visually consistent
**Depends on**: Phase 2
**Requirements**: YOU-01, YOU-02, DSGN-01, DSGN-02
**Success Criteria** (what must be TRUE):
  1. User can see their total movies seen, average rating, and watchlist size on the You page
  2. User can set a display name and avatar on the You page
  3. Colors, typography, and spacing match the Figma design system across all pages
  4. Hover, active, empty, and loading states are consistent across all components
**Plans**: TBD

Plans:
- [ ] 03-01: Build YouPage with stats and basic profile (display name, avatar)
- [ ] 03-02: Visual overhaul — update color palette, component states, and design tokens to match Figma

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Movie Logging | 2/2 | Complete   | 2026-03-09 |
| 2. Seen Page | 0/2 | Not started | - |
| 3. Profile, Stats, and Polish | 0/2 | Not started | - |
