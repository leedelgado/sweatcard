import { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';

const IMAGES = ['/hero1.png', '/hero2.png', '/hero3.png'];
const SLIDE_DURATION = 1600;  // ms each image is fully visible
const FADE_DURATION  = 600;   // ms crossfade between images
const TOTAL_STAY     = IMAGES.length * (SLIDE_DURATION + FADE_DURATION); // ~6.6s
const FADE_OUT_START = TOTAL_STAY + 400;
const DONE_DELAY     = FADE_OUT_START + 500;

export default function SplashScreen({ onDone }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);

  // Cycle through images
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % IMAGES.length;
      setActiveIdx(idx);
    }, SLIDE_DURATION + FADE_DURATION);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance to app
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), FADE_OUT_START);
    const doneTimer = setTimeout(() => onDone(), DONE_DELAY);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  function skip() {
    setFading(true);
    setTimeout(onDone, 500);
  }

  return (
    <div className={`${styles.splash} ${fading ? styles.fadeOut : ''}`} onClick={skip}>

      {/* Crossfading hero images — all stacked, only active one is visible */}
      <div className={styles.heroWrap}>
        {IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`${styles.hero} ${i === activeIdx ? styles.heroActive : ''}`}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ))}
        <div className={styles.gradient} />
      </div>

      {/* Content pinned to bottom */}
      <div className={styles.content}>
        <p className={styles.wordmark}>SweatCard</p>
        <h1 className={styles.tagline}>Workout Sessions<br />into Stories.</h1>
        <p className={styles.sub}>Your Apple Watch data. Ready to share.</p>
      </div>

    </div>
  );
}
