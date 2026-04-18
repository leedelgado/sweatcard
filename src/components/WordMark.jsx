import styles from './WordMark.module.css';

/**
 * StatShot wordmark — "STAT" heavy, "SHOT" ultralight.
 * size: 'sm' | 'md' | 'lg'
 */
export default function WordMark({ size = 'md', className = '' }) {
  return (
    <span className={`${styles.mark} ${styles[size]} ${className}`}>
      <span className={styles.heavy}>STAT</span><span className={styles.light}>SHOT</span>
    </span>
  );
}
