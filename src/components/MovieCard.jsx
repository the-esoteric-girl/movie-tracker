function MovieCard({ title, posterPath, releaseDate, voteAverage }) {
  const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`
  const year = releaseDate.slice(0, 4)
  const rating = voteAverage.toFixed(1)

  return (
    <div className="movie-card">
      <img src={posterUrl} alt={title} />
      <div className="movie-info">
        <h3>{title}</h3>
        <span>{year}</span>
        <span>{rating} ⭐</span>
      </div>
    </div>
  )
}

export default MovieCard