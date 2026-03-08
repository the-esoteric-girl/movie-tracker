import { Link } from "react-router-dom";
import styles from "./MovieCard.module.css";

function MovieCard({
  id,
  title,
  posterPath,
  releaseDate,
  voteAverage,
  isInWatchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}) {
  const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
  //    defensive coding. some movies have no release date. ? : if/else
  const year = releaseDate ? releaseDate.slice(0, 4) : "N/A";
  const rating = voteAverage ? voteAverage.toFixed(1) : "N/A";

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWatchlist) {
      onRemoveFromWatchlist();
    } else {
      onAddToWatchlist();
    }
  };

  return (
    <Link to={`/movie/${id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <img src={posterUrl} alt={title} className={styles.poster} />
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.meta}>
            <span>{year}</span>
            <span className={styles.rating}>★ {rating}</span>
          </div>
          <button
            className={`${styles.watchlistBtn} ${isInWatchlist ? styles.added : ""}`}
            onClick={handleWatchlistClick}
          >
            {isInWatchlist ? "✓ ADDED" : "+ WATCHLIST"}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
