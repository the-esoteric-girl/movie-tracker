import styles from "./MovieCard.module.css";

function MovieCard({
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

  return (
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
          onClick={isInWatchlist ? onRemoveFromWatchlist : onAddToWatchlist}
        >
          {isInWatchlist ? "✓ ADDED" : "+ WATCHLIST"}
        </button>
      </div>
    </div>
  );
}

export default MovieCard;
