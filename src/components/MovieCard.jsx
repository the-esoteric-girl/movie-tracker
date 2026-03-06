import styles from './MovieCard.module.css'

function MovieCard({ title, posterPath, releaseDate, voteAverage }) {
  const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`
  const year = releaseDate.slice(0, 4)
  const rating = voteAverage.toFixed(1)

  return (
    <div className={styles.card}>
      <img src={posterUrl} alt={title} className={styles.poster} />
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          <span>{year}</span>
          <span className={styles.rating}>⭐ {rating}</span>
        </div>
      </div>
    </div>
  )
}

export default MovieCard