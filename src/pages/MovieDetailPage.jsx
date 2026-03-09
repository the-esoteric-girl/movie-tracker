import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./MovieDetailPage.module.css";
import LogModal from "../components/LogModal";

export default function MovieDetailPage({
  watchlist,
  seenList,
  onAdd,
  onRemove,
  onAddSeen,
  onRemoveSeen,
  onUpdateSeen,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setMovie(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      setMovie(null);
      setLoading(true);
    };
  }, [id, apiKey]);

  const isInWatchlist = movie
    ? watchlist.some((m) => m.id === movie.id)
    : false;
  const isInSeen = movie ? seenList.some((m) => m.id === movie.id) : false;

  const toggleWatchlist = () => {
    if (!movie) return;
    isInWatchlist ? onRemove(movie.id) : onAdd(movie);
  };

  const openLogModal = () => {
    if (!movie) return;
    setShowLogModal(true);
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <span className={styles.loadingText}>Loading</span>
        <span className={styles.loadingDots}>...</span>
      </div>
    );
  }

  if (!movie || movie.success === false) {
    return (
      <div className={styles.loadingScreen}>
        <span className={styles.loadingText}>Movie not found</span>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;
  const cast = movie.credits?.cast?.slice(0, 14) || [];

  return (
    <div className={styles.page}>
      {/* Hero backdrop */}
      <div className={styles.hero}>
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            className={styles.backdrop}
            aria-hidden="true"
          />
        ) : (
          <div className={styles.backdropFallback} />
        )}
        <div className={styles.heroGradient} />
      </div>

      {/* Back button overlays the hero */}
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← BACK
      </button>

      {/* Content pulls up to overlap the hero */}
      <div className={styles.content}>
        <div className={styles.mainRow}>
          {posterUrl && (
            <div className={styles.posterWrap}>
              <img
                src={posterUrl}
                alt={movie.title}
                className={styles.poster}
              />
            </div>
          )}

          <div className={styles.info}>
            <h1 className={styles.title}>{movie.title}</h1>

            <div className={styles.metaRow}>
              <span className={styles.metaItem}>{year}</span>
              {runtime && (
                <>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.metaItem}>{runtime}</span>
                </>
              )}
              {movie.vote_average > 0 && (
                <>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.metaRating}>
                    ★ {movie.vote_average.toFixed(1)}
                  </span>
                </>
              )}
            </div>

            {movie.genres?.length > 0 && (
              <div className={styles.genres}>
                {movie.genres.map((g) => (
                  <span key={g.id} className={styles.genre}>
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.actions}>
              <button
                className={`${styles.btn} ${isInWatchlist ? styles.btnSavedActive : ""}`}
                onClick={toggleWatchlist}
              >
                {isInWatchlist ? "✓ SAVED" : "+ SAVE"}
              </button>
              <button
                className={`${styles.btn} ${styles.btnWatched} ${isInSeen ? styles.btnWatchedActive : ""}`}
                onClick={openLogModal}
              >
                {isInSeen ? "✓ LOGGED" : "LOG IT"}
              </button>
            </div>
          </div>
        </div>

        {movie.overview && (
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Synopsis</h2>
            <p className={styles.overview}>{movie.overview}</p>
          </section>
        )}

        {cast.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>Cast</h2>
            <div className={styles.castStrip}>
              {cast.map((person) => (
                <div
                  key={person.cast_id ?? person.id}
                  className={styles.castCard}
                >
                  <div className={styles.castPhotoWrap}>
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        className={styles.castPhoto}
                      />
                    ) : (
                      <div className={styles.castPhotoEmpty}>?</div>
                    )}
                  </div>
                  <p className={styles.castName}>{person.name}</p>
                  <p className={styles.castChar}>{person.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {showLogModal && movie && (
        <LogModal
          movie={movie}
          initialData={isInSeen ? (seenList.find((m) => m.id === movie.id) ?? null) : null}
          onSave={(data) => {
            if (isInSeen) {
              onUpdateSeen(movie.id, data);
            } else {
              onAddSeen({ ...movie, ...data });
            }
            setShowLogModal(false);
          }}
          onClose={() => setShowLogModal(false)}
        />
      )}
    </div>
  );
}
