import { useState } from "react";
import MovieCard from "../components/MovieCard";

export default function SavedPage() {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem("watchlist");
    return saved ? JSON.parse(saved) : [];
  });

  const remove = (id) => {
    const updated = watchlist.filter((m) => m.id !== id);
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  return (
    <div className="app">
      <h1 className="heading">Saved</h1>
      {watchlist.length === 0 ? (
        <p className="empty-state">Nothing saved yet.</p>
      ) : (
        <div className="movie-grid">
          {watchlist.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              releaseDate={movie.release_date}
              voteAverage={movie.vote_average}
              isInWatchlist={true}
              onAddToWatchlist={() => {}}
              onRemoveFromWatchlist={() => remove(movie.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
