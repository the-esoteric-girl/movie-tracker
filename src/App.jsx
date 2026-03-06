import { useState, useEffect } from 'react'
import MovieCard from './components/MovieCard'
import './App.css'

function App() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  const [movies, setMovies] = useState([])

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        setMovies(data.results)
      })
  }, [])

  return (
    <div className="app">
      <h1 className="heading">Movie Tracker</h1>
      <div className="grid">
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            posterPath={movie.poster_path}
            releaseDate={movie.release_date}
            voteAverage={movie.vote_average}
          />
        ))}
      </div>
    </div>
  )
}

export default App