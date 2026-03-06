import styles from "./MoodSelector.module.css";

const MOODS = [
  { label: "Make Me Cry", genres: "18" },
  { label: "Something Funny", genres: "35" },
  { label: "Scare Me", genres: "27,53" },
  { label: "Use My Brain", genres: "878,9648" },
  { label: "Turn It Off", genres: "16,10751" },
  { label: "Something Romantic", genres: "10749" },
  { label: "Get My Pulse Up", genres: "28,12" },
];

function MoodSelector({ activeMood, onMoodSelect }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>WHAT'S THE VIBE?</p>
      <div className={styles.tags}>
        {MOODS.map((mood) => (
          <button
            key={mood.label}
            className={`${styles.tag} ${activeMood === mood.label ? styles.active : ""}`}
            onClick={() => onMoodSelect(mood)}
          >
            {mood.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MoodSelector;
