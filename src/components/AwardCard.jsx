import styles from './AwardCard.module.css';
import { formatDate } from '../utils/formatStats';

export default function AwardCard({ award }) {
  const date = formatDate(award.earnedDate);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>

        <div className={styles.emojiWrap}>
          <span className={styles.emoji}>{award.emoji}</span>
        </div>

        <p className={styles.title} style={{ color: award.color }}>
          {award.title}
        </p>

        {award.description && (
          <p className={styles.description}>{award.description}</p>
        )}

        <div className={styles.footer}>
          <span className={styles.appName}>Stat Shot</span>
          <span className={styles.date}>{date}</span>
        </div>

      </div>
    </div>
  );
}
