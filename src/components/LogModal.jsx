import { useState, useEffect } from "react";
import styles from "./LogModal.module.css";

export default function LogModal({ movie, initialData, onSave, onClose }) {
  const today = new Date().toISOString().split("T")[0];
  const [rating, setRating] = useState(initialData?.rating ?? 0);
  const [review, setReview] = useState(initialData?.review ?? "");
  const [watchedDate, setWatchedDate] = useState(
    initialData?.watchedDate ?? today,
  );
  const [hoverRating, setHoverRating] = useState(null);
  const [showDateInput, setShowDateInput] = useState(false);

  useEffect(() => {
    setRating(initialData?.rating ?? 0);
    setReview(initialData?.review ?? "");
    setWatchedDate(initialData?.watchedDate ?? today);
    setHoverRating(null);
  }, [initialData, today]);

  const isDirty =
    rating !== (initialData?.rating ?? 0) ||
    review !== (initialData?.review ?? "") ||
    watchedDate !== (initialData?.watchedDate ?? today);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const displayRating = hoverRating ?? rating;

  function getStarContent(i) {
    if (displayRating >= i) {
      return { type: "full" };
    } else if (displayRating >= i - 0.5) {
      return { type: "half" };
    }
    return { type: "empty" };
  }

  function formatDate(dateStr) {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const releaseYear = movie?.release_date ? movie.release_date.slice(0, 4) : "";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalTitle}>I Watched...</div>

        {/* Movie info row */}
        <div className={styles.movieRow}>
          {posterUrl && (
            <img
              src={posterUrl}
              alt={movie.title}
              className={styles.movieThumb}
            />
          )}
          <div>
            <div className={styles.movieTitle}>{movie?.title}</div>
            {releaseYear && (
              <div className={styles.movieYear}>{releaseYear}</div>
            )}
          </div>
        </div>

        {/* Stars row */}
        <div
          className={styles.starsRow}
          onMouseLeave={() => setHoverRating(null)}
        >
          {[1, 2, 3, 4, 5].map((i) => {
            const starType = getStarContent(i);
            return (
              <span key={i} className={styles.starWrap}>
                {starType.type === "full" && (
                  <span
                    className={styles.starBack}
                    style={{ color: "var(--accent-lime)" }}
                  >
                    ★
                  </span>
                )}
                {starType.type === "half" && (
                  <>
                    <span
                      className={styles.starBack}
                      style={{ color: "var(--border-subtle)" }}
                    >
                      ☆
                    </span>
                    <span
                      className={styles.starFront}
                      style={{ color: "var(--accent-lime)" }}
                    >
                      ★
                    </span>
                  </>
                )}
                {starType.type === "empty" && (
                  <span
                    className={styles.starBack}
                    style={{ color: "var(--border-subtle)" }}
                  >
                    ☆
                  </span>
                )}
                {/* Hit detection overlays */}
                <span
                  className={styles.starLeftHalf}
                  onMouseEnter={() => setHoverRating(i - 0.5)}
                  onClick={() => setRating(i - 0.5)}
                />
                <span
                  className={styles.starRightHalf}
                  onMouseEnter={() => setHoverRating(i)}
                  onClick={() => setRating(i)}
                />
              </span>
            );
          })}
          <span className={styles.ratingDisplay}>
            {displayRating > 0 ? displayRating.toFixed(1) : "0"}/5
          </span>
        </div>

        {/* Date row */}
        <div className={styles.dateRow}>
          <span className={styles.dateLabel}>Date</span>
          {showDateInput ? (
            <input
              type="date"
              className={styles.dateInput}
              value={watchedDate}
              autoFocus
              onChange={(e) => setWatchedDate(e.target.value)}
              onBlur={() => setShowDateInput(false)}
            />
          ) : (
            <span
              className={styles.dateText}
              onClick={() => setShowDateInput(true)}
            >
              {formatDate(watchedDate)}
            </span>
          )}
        </div>

        {/* Review textarea */}
        <textarea
          className={styles.reviewArea}
          placeholder="My honest thoughts..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
        />

        {/* Buttons row */}
        <div className={styles.btnRow}>
          <button
            className={`${styles.cancelBtn}${isDirty ? " " + styles.cancelDirty : ""}`}
            onClick={onClose}
          >
            {isDirty ? "DISCARD CHANGES" : "CANCEL"}
          </button>
          <button
            className={styles.logBtn}
            onClick={() => onSave({ rating, review, watchedDate })}
          >
            LOG IT
          </button>
        </div>
      </div>
    </div>
  );
}
