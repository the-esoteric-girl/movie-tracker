import { useState, useEffect } from "react";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim() === "") {
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
          .then((response) => response.json())
          .then((data) => setMovies(data.results));
      } else {
        fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`,
        )
          .then((response) => response.json())
          .then((data) => setMovies(data.results));
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div className="app">
      <h1 className="heading">Reverie</h1>
      <SearchBar query={query} onQueryChange={setQuery} />
      <div className="movie-grid">
        {movies.map((movie) => (
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
  );
}

export default App;
