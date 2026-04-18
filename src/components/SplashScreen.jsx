import { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';
import WordMark from './WordMark';

const IMAGES = ['/hero1.png', '/hero2.png', '/hero3.png'];
const SLIDE_DURATION = 3000;
const FADE_DURATION  = 800;
const TOTAL_STAY     = IMAGES.length * (SLIDE_DURATION + FADE_DURATION);
const FADE_OUT_START = TOTAL_STAY + 600;
const DONE_DELAY     = FADE_OUT_START + 600;

export default function SplashScreen({ onDone }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % IMAGES.length;
      setActiveIdx(idx);
    }, SLIDE_DURATION + FADE_DURATION);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), FADE_OUT_START);
    const doneTimer = setTimeout(() => onDone(), DONE_DELAY);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  function skip() { setFading(true); setTimeout(onDone, 500); }

  return (
    <div className={`${styles.splash} ${fading ? styles.fadeOut : ''}`} onClick={skip}>

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
      </div>

      <div className={styles.content}>
        <WordMark size="lg" className={styles.logo} />
        <p className={styles.tagline}>Workout Sessions into Stories.</p>
        <p className={styles.sub}>Your Apple Watch data. Ready to share.</p>
      </div>

    </div>
  );
}
