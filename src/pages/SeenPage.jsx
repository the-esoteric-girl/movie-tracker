import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./SeenPage.module.css";

const GridIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor" aria-hidden="true">
    <rect x="0" y="0" width="5.5" height="5.5" />
    <rect x="7.5" y="0" width="5.5" height="5.5" />
    <rect x="0" y="7.5" width="5.5" height="5.5" />
    <rect x="7.5" y="7.5" width="5.5" height="5.5" />
  </svg>
);

const ListIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor" aria-hidden="true">
    <rect x="0" y="1" width="13" height="2.5" />
    <rect x="0" y="5.25" width="13" height="2.5" />
    <rect x="0" y="9.5" width="13" height="2.5" />
  </svg>
);

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });
}

function getRating(entry) {
  if (entry.rating > 0) {
    return { value: entry.rating.toFixed(1), isUser: true };
  }
  if (entry.vote_average) {
    return { value: (entry.vote_average / 2).toFixed(1), isUser: false };
  }
  return { value: null, isUser: false };
}

export default function SeenPage({ seenList, onRemove, onUpdateSeen }) {
  const [view, setView] = useState("grid");

  if (seenList.length === 0) {
    return (
      <div className="app">
        <h1 className="heading">Seen</h1>
        <div className={styles.emptyState}>
          <p className={styles.emptyHeading}>Every great list starts with one.</p>
          <p className={styles.emptyHint}>Find something to watch and log your first movie.</p>
          <Link to="/" className={styles.emptyLink}>BROWSE MOVIES →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className={styles.pageHeader}>
        <h1 className="heading">Seen</h1>
        <div className={styles.toggleWrap}>
          <button
            className={`${styles.toggleBtn} ${view === "grid" ? styles.toggleActive : ""}`}
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <GridIcon /> GRID
          </button>
          <button
            className={`${styles.toggleBtn} ${view === "list" ? styles.toggleActive : ""}`}
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <ListIcon /> LIST
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="movie-grid">
          {seenList.map((entry) => {
            const { value: ratingVal, isUser } = getRating(entry);
            const year = entry.release_date ? entry.release_date.slice(0, 4) : "N/A";
            return (
              <Link key={entry.id} to={`/movie/${entry.id}`} className={styles.gridCardLink}>
                <div className={styles.gridCard}>
                  {entry.poster_path
                    ? <img src={`https://image.tmdb.org/t/p/w500${entry.poster_path}`} alt={entry.title} className={styles.gridPoster} />
                    : <div className={styles.gridPosterFallback} />}
                  <div className={styles.gridInfo}>
                    <p className={styles.gridTitle}>{entry.title}</p>
                    <div className={styles.gridMeta}>
                      <span className={styles.gridYear}>{year}</span>
                      <span className={isUser ? styles.gridRatingUser : styles.gridRatingCommunity}>
                        {ratingVal ? `★ ${ratingVal}` : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={styles.listWrap}>
          {seenList.map((entry) => {
            const { value: ratingVal, isUser } = getRating(entry);
            return (
              <Link key={entry.id} to={`/movie/${entry.id}`} className={styles.listRowLink}>
                <div className={styles.listRow}>
                  {entry.poster_path
                    ? <img src={`https://image.tmdb.org/t/p/w185${entry.poster_path}`} alt={entry.title} className={styles.listThumb} />
                    : <div className={styles.listThumbFallback} />}
                  <div className={styles.listBody}>
                    <p className={styles.listTitle}>{entry.title}</p>
                    <span className={isUser ? styles.listRatingUser : styles.listRatingCommunity}>
                      {ratingVal ? `★ ${ratingVal}` : "—"}
                    </span>
                    {entry.review && (
                      <p className={styles.listReview}>{entry.review}</p>
                    )}
                    <p className={styles.listDate}>{formatDate(entry.watchedDate)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
