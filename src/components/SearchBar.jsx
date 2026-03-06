import styles from "./SearchBar.module.css";

function SearchBar({ query, onQueryChange }) {
  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        className={styles.input}
        placeholder="SEARCH FILMS..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      {query && (
        <button className={styles.clear} onClick={() => onQueryChange("")}>
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchBar;
