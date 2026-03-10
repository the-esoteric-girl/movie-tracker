import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./SeenPage.module.css";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });
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
          >GRID</button>
          <button
            className={`${styles.toggleBtn} ${view === "list" ? styles.toggleActive : ""}`}
            onClick={() => setView("list")}
          >LIST</button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="movie-grid">
          {seenList.map((entry) => (
            <div key={entry.id} className={styles.gridCard} onClick={() => {}}>
              {entry.poster_path
                ? <img src={`https://image.tmdb.org/t/p/w500${entry.poster_path}`} alt={entry.title} className={styles.gridPoster} />
                : <div className={styles.gridPosterFallback} />}
              <div className={styles.gridInfo}>
                <p className={styles.gridTitle}>{entry.title}</p>
                <p className={styles.gridRating}>
                  {entry.rating > 0 ? `★ ${entry.rating.toFixed(1)}` : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.listWrap}>
          {seenList.map((entry) => (
            <div key={entry.id} className={styles.listRow} onClick={() => {}}>
              {entry.poster_path
                ? <img src={`https://image.tmdb.org/t/p/w185${entry.poster_path}`} alt={entry.title} className={styles.listThumb} />
                : <div className={styles.listThumbFallback} />}
              <div className={styles.listBody}>
                <p className={styles.listTitle}>{entry.title}</p>
                <p className={styles.listRating}>
                  {entry.rating > 0 ? `★ ${entry.rating.toFixed(1)}` : "—"}
                </p>
                {entry.review && (
                  <p className={styles.listReview}>
                    {entry.review.length > 80 ? entry.review.slice(0, 80) + "…" : entry.review}
                  </p>
                )}
                <p className={styles.listDate}>{formatDate(entry.watchedDate)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
