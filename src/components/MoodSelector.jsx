import styles from "./MoodSelector.module.css";
import { MOODS } from "../constants/moods";

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
