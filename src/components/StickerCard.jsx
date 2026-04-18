import styles from './StickerCard.module.css';
import { getStats, formatTimeRange } from '../utils/formatStats';
import WordMark from './WordMark';

const WORKOUT_EMOJI = {
  strength:       '🏋️',
  cycling_indoor: '🚴',
  elliptical:     '🏃',
  running:        '🏃',
  walking:        '🚶',
};

export default function StickerCard({ workout }) {
  const stats = getStats(workout);
  const rows = [];
  for (let i = 0; i < stats.length; i += 2) {
    rows.push(stats.slice(i, i + 2));
  }

  const emoji     = WORKOUT_EMOJI[workout.workoutTypeKey] || '🏋️';
  const timeRange = formatTimeRange(workout.startDate, workout.endDate);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <span className={styles.iconEmoji}>{emoji}</span>
          </div>
          <div className={styles.titleGroup}>
            <p className={styles.workoutType}>{workout.workoutType}</p>
            <p className={styles.metaTime}>{timeRange}</p>
          </div>
        </div>

        {/* Workout Details */}
        <p className={styles.sectionLabel}>Workout Details</p>

        <div className={styles.statContainer}>
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className={styles.statRow}>
              {row.map((stat, colIdx) => (
                <div
                  key={colIdx}
                  className={`${styles.statCell} ${colIdx === 0 ? styles.statCellLeft : styles.statCellRight}`}
                >
                  <p className={styles.statLabel}>{stat.label}</p>
                  <p className={styles.statValue} style={{ color: stat.color }}>
                    {stat.value}
                    {stat.unit && <span className={styles.statUnit}>{stat.unit}</span>}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <WordMark size="sm" />
        </div>

      </div>
    </div>
  );
}
