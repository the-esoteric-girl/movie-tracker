# Testing Patterns

**Analysis Date:** 2026-03-09

## Current Test Status

**No test framework configured or tests written.**

This is a frontend application with no test suite. The codebase contains no:
- Test files (no `.test.js`, `.spec.js` files in `src/`)
- Test configuration (no Jest, Vitest, or testing-library config)
- Test dependencies (none in `package.json`)

## Recommended Testing Approach

### Framework Selection

**Recommended Setup:**
- **Test Runner:** Vitest (fast, Vite-integrated, ESM-native)
- **Component Testing:** React Testing Library (for components)
- **Assertion Library:** Vitest's built-in assertions + React Testing Library matchers

**Installation would be:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Recommended Configuration

**vitest.config.js (to create):**
```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})
```

**src/test/setup.js (to create):**
```javascript
import '@testing-library/jest-dom'
```

### Run Commands (when implemented)

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode (recommended during development)
npm run test:coverage    # Generate coverage report
```

## Test File Organization

**Recommended Location:**
- Co-located with source files: `src/components/MovieCard.jsx` → `src/components/MovieCard.test.jsx`
- Or separate `src/__tests__/` directory

**Recommended Naming:**
- `ComponentName.test.jsx` for component tests
- `functionName.test.js` for utility tests

**Directory Structure:**
```
src/
├── components/
│   ├── MovieCard.jsx
│   ├── MovieCard.test.jsx
│   └── MovieCard.module.css
├── pages/
│   ├── FindPage.jsx
│   ├── FindPage.test.jsx
│   └── ...
└── test/
    └── setup.js
```

## Suggested Test Structure Pattern

**For Components (React Testing Library style):**
```javascript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MovieCard from './MovieCard'

describe('MovieCard', () => {
  it('renders movie title and release year', () => {
    render(
      <MovieCard
        id={550}
        title="Fight Club"
        posterPath="/path.jpg"
        releaseDate="1999-10-15"
        voteAverage={8.8}
      />
    )
    expect(screen.getByText('Fight Club')).toBeInTheDocument()
    expect(screen.getByText('1999')).toBeInTheDocument()
  })

  it('displays "N/A" for missing release date', () => {
    render(
      <MovieCard
        id={550}
        title="Fight Club"
        posterPath="/path.jpg"
        releaseDate={null}
        voteAverage={8.8}
      />
    )
    expect(screen.getByText('N/A')).toBeInTheDocument()
  })
})
```

**For Utilities (Unit tests):**
```javascript
import { describe, it, expect } from 'vitest'
import { loadFromStorage, saveToStorage } from '../App'

describe('Storage utilities', () => {
  it('saves and loads from localStorage', () => {
    const data = [{ id: 1, title: 'Test' }]
    saveToStorage('watchlist', data)
    const loaded = loadFromStorage('watchlist', [])
    expect(loaded).toEqual(data)
  })

  it('returns fallback on parse error', () => {
    localStorage.setItem('test', 'invalid json')
    const result = loadFromStorage('test', [])
    expect(result).toEqual([])
  })
})
```

## Mocking Strategy

**Framework:** Vitest provides `vi` object for mocking

**What to Mock:**
- Fetch calls for TMDB API
- localStorage (use `@testing-library/jest-dom` utilities)
- React Router navigation (wrap in MemoryRouter for navigation tests)

**What NOT to Mock:**
- Component rendering
- User interactions (use `userEvent` instead)
- Conditional rendering logic
- CSS Modules imports

**Example: Mocking fetch:**
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import FindPage from './FindPage'

describe('FindPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('fetches and displays popular movies on mount', async () => {
    const mockMovies = [
      { id: 1, title: 'Movie', poster_path: '/img.jpg' }
    ]
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ results: mockMovies })
    })

    render(<FindPage />)

    await waitFor(() => {
      expect(screen.getByText('Movie')).toBeInTheDocument()
    })
  })
})
```

## Test Types

### Unit Tests
**Scope:** Individual functions and components in isolation

**Candidates in this codebase:**
- `loadFromStorage()` and `saveToStorage()` in `src/App.jsx`
- Filter/map logic in list pages
- String formatting (year extraction, rating display)

**Approach:** Vitest with direct function calls

### Component Tests
**Scope:** Component rendering, prop handling, user interactions

**Candidates:**
- `MovieCard.jsx` - Renders props correctly, defensive rendering for missing data
- `SearchBar.jsx` - Input handling, clear button visibility/behavior
- `MoodSelector.jsx` - Mood selection, active state styling
- `BottomNav.jsx` - NavLink routing, active state

**Approach:** React Testing Library with user-centric queries

### Integration Tests
**Scope:** Multiple components working together, state flows

**Candidates:**
- `FindPage.jsx` - Search + mood filter interaction
- `MovieDetailPage.jsx` - Fetch data, display, button interactions
- `SavedPage.jsx` - Display watchlist, filtering empty state

**Approach:** React Testing Library with router context

### E2E Tests
**Status:** Not currently implemented

**Recommended if added:** Playwright or Cypress
- Would test complete user flows (search → save → view saved)
- Full routing and state persistence
- Cross-browser testing

## Fixtures and Test Data

**Location (when created):**
`src/test/fixtures/movies.js` or `src/__mocks__/`

**Pattern:**
```javascript
// src/test/fixtures/movies.js
export const mockMovie = {
  id: 550,
  title: 'Fight Club',
  poster_path: '/path.jpg',
  backdrop_path: '/backdrop.jpg',
  release_date: '1999-10-15',
  vote_average: 8.8,
  overview: 'A ticking-time-bomb insomniac...',
}

export const mockMovies = [
  mockMovie,
  {
    id: 278,
    title: 'The Shawshank Redemption',
    // ...
  }
]

export const mockWatchlist = [mockMovie]
```

## Coverage Requirements

**Current:** None enforced

**Recommended targets (when testing added):**
- Statements: 70%+
- Branches: 65%+ (harder to achieve with conditional rendering)
- Functions: 80%+
- Lines: 70%+

**View Coverage:**
```bash
npm run test:coverage
```

This generates `coverage/` directory with HTML report.

## Testing Priorities

**High Priority (core functionality):**
1. `src/App.jsx` - State management and localStorage (side effects critical)
2. `src/pages/MovieDetailPage.jsx` - API fetch, stale request handling, defensive rendering
3. `src/pages/FindPage.jsx` - Search + mood filter logic, debounce behavior

**Medium Priority (user experience):**
4. `src/components/MovieCard.jsx` - Display with defensive rendering
5. `src/components/SearchBar.jsx` - Input handling
6. `src/pages/SavedPage.jsx` - Watchlist display

**Lower Priority (presentational):**
7. `src/components/MoodSelector.jsx` - Tag rendering
8. `src/components/BottomNav.jsx` - Navigation (tested via integration)

## Critical Behaviors to Test

### localStorage Persistence
- Watchlist saves to localStorage on add/remove
- SeenList saves to localStorage on add/remove
- Corrupted localStorage gracefully falls back to empty arrays

### Defensive Rendering
- Null/undefined props display "N/A"
- Missing dates, ratings, runtime handled
- Fallback images for missing profile_path in cast

### API State Management
- Stale fetch requests don't update after unmount (MovieDetailPage)
- Debounce prevents excessive API calls (FindPage)
- Loading/error states render appropriately

### User Interactions
- SearchBar clears on input
- Mood selector toggles active state
- Save/Mark Watched buttons toggle state correctly
- Navigation via BottomNav works

## Notes

- **No pre-existing tests:** All testing is a greenfield effort
- **No CI/CD configured:** Tests would need to be wired into CI pipeline
- **React 19 + Vitest:** Very recent React version; ensure testing library compatibility
- **ESM modules:** Both Vite and Vitest are ESM-native, no CommonJS issues expected

---

*Testing analysis: 2026-03-09*
