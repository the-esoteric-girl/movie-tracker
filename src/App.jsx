import { useState, useEffect } from 'react'

function App() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  const [movies, setMovies] = useState([])

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setMovies(data.results)
      })
  }, [])

  return (
    <div>
      <h1>Movie Tracker</h1>
    </div>
  )
}

export default App