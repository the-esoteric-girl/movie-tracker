import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import FindPage from "./pages/FindPage";
import SavedPage from "./pages/SavedPage";
import SeenPage from "./pages/SeenPage";
import YouPage from "./pages/YouPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import BottomNav from "./components/BottomNav";
import "./App.css";

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function App() {
  const [watchlist, setWatchlist] = useState(() =>
    loadFromStorage("watchlist", []),
  );
  const [seenList, setSeenList] = useState(() =>
    loadFromStorage("seenList", []),
  );

  function addToWatchlist(movie) {
    const updated = [...watchlist, movie];
    setWatchlist(updated);
    saveToStorage("watchlist", updated);
  }

  function removeFromWatchlist(movieId) {
    const updated = watchlist.filter((m) => m.id !== movieId);
    setWatchlist(updated);
    saveToStorage("watchlist", updated);
  }

  // Expected shape: { ...tmdbMovieFields, rating: Number, review: String, watchedDate: "YYYY-MM-DD" }
  function addToSeen(movie) {
    const updated = [...seenList, movie];
    setSeenList(updated);
    saveToStorage("seenList", updated);
  }

  function removeFromSeen(movieId) {
    const updated = seenList.filter((m) => m.id !== movieId);
    setSeenList(updated);
    saveToStorage("seenList", updated);
  }

  function updateSeen(movieId, fields) {
    const updated = seenList.map((m) =>
      m.id === movieId ? { ...m, ...fields } : m,
    );
    setSeenList(updated);
    saveToStorage("seenList", updated);
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <FindPage />
          }
        />
        <Route
          path="/saved"
          element={
            <SavedPage watchlist={watchlist} />
          }
        />
        <Route
          path="/seen"
          element={<SeenPage seenList={seenList} onRemove={removeFromSeen} />}
        />
        <Route path="/you" element={<YouPage />} />
        <Route
          path="/movie/:id"
          element={
            <MovieDetailPage
              watchlist={watchlist}
              seenList={seenList}
              onAdd={addToWatchlist}
              onRemove={removeFromWatchlist}
              onAddSeen={addToSeen}
              onRemoveSeen={removeFromSeen}
              onUpdateSeen={updateSeen}
            />
          }
        />
      </Routes>
      <BottomNav />
    </>
  );
}
