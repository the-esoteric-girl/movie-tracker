import MovieCard from "../components/MovieCard";

export default function SavedPage({ watchlist }) {
  return (
    <div className="app">
      <h1 className="heading">Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className="empty-state">Nothing saved yet.</p>
      ) : (
        <div className="movie-grid">
          {watchlist.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              releaseDate={movie.release_date}
              voteAverage={movie.vote_average}
            />
          ))}
        </div>
      )}
    </div>
  );
}
