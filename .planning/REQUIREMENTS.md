# Requirements: Reverie

**Defined:** 2026-03-09
**Core Value:** The moment of logging a movie — rating it, jotting a thought, remembering when you watched it — should feel satisfying and personal.

## v1 Requirements

### Movie Logging

- [ ] **LOG-01**: User can mark a movie as seen from the detail page
- [ ] **LOG-02**: User can rate a movie ½–5★ (half-star increments) when logging it
- [ ] **LOG-03**: User can write an optional text review when logging
- [ ] **LOG-04**: User can set the date watched (defaults to today)
- [ ] **LOG-05**: User can edit their rating/review for a movie already in seenList
- [ ] **LOG-06**: Modal can be triggered from multiple places (detail page, seen list)

### Seen Page

- [ ] **SEEN-01**: User can view all logged movies in a grid view
- [ ] **SEEN-02**: User can toggle to a list view that shows rating and review snippet
- [ ] **SEEN-03**: User can open a movie's review modal from the seen list

### You Page

- [ ] **YOU-01**: User can see their stats — total movies seen, average rating, watchlist size
- [ ] **YOU-02**: User can set a display name and avatar (basic profile)

### Design Overhaul

- [ ] **DSGN-01**: Color palette and visual system updated to match Figma designs
- [ ] **DSGN-02**: Component states (hover, active, empty, loading) are consistent across the app

## v2 Requirements

### Data Management

- **DATA-01**: User can export their watchlist and seen list
- **DATA-02**: User can clear watchlist or seen list

### Discovery Enhancements

- **DISC-01**: Quick-add to watchlist from grid (hover overlay)
- **DISC-02**: Filter/sort seen list by rating, date watched, genre

### Social

- **SOCL-01**: User can share a movie or review via link

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts / authentication | No backend — localStorage only for v1 |
| Social features (following, shared lists) | Future milestone |
| Mobile app / PWA | Web-first |
| Real-time or collaborative features | Out of scope entirely |
| Rewatch tracking | Deferred — not mentioned for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LOG-01 | Phase 1 | Pending |
| LOG-02 | Phase 1 | Pending |
| LOG-03 | Phase 1 | Pending |
| LOG-04 | Phase 1 | Pending |
| LOG-05 | Phase 1 | Pending |
| LOG-06 | Phase 2 | Pending |
| SEEN-01 | Phase 2 | Pending |
| SEEN-02 | Phase 2 | Pending |
| SEEN-03 | Phase 2 | Pending |
| YOU-01 | Phase 3 | Pending |
| YOU-02 | Phase 3 | Pending |
| DSGN-01 | Phase 3 | Pending |
| DSGN-02 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-09*
*Last updated: 2026-03-09 after roadmap creation*
