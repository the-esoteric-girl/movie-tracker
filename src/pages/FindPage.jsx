import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import MoodSelector from "../components/MoodSelector";
import { MOODS } from "../constants/moods";

export default function FindPage() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [activeMood, setActiveMood] = useState(null);

  const handleMoodSelect = (mood) => {
    if (activeMood === mood.label) {
      setActiveMood(null);
    } else {
      setActiveMood(mood.label);
      setQuery("");
    }
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    if (value.trim() !== "") {
      setActiveMood(null);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim() !== "") {
        fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`,
        )
          .then((res) => res.json())
          .then((data) => setMovies(data.results));
      } else if (activeMood) {
        const mood = MOODS.find((m) => m.label === activeMood);
        fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${mood.genres}&sort_by=popularity.desc`,
        )
          .then((res) => res.json())
          .then((data) => setMovies(data.results));
      } else {
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
          .then((res) => res.json())
          .then((data) => setMovies(data.results));
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query, activeMood]);

  return (
    <div className="app">
      <h1 className="heading">Reverie</h1>
      <SearchBar query={query} onQueryChange={handleQueryChange} />
      <MoodSelector activeMood={activeMood} onMoodSelect={handleMoodSelect} />
      <div className="movie-grid">
        {movies.map((movie) => (
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
    </div>
  );
}
