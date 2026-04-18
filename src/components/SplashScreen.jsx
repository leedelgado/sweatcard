import { useEffect, useState } from 'react';
import styles from './SplashScreen.module.css';
import WordMark from './WordMark';

const IMAGES = ['/hero1.png', '/hero2.png', '/hero3.png', '/hero4.png'];
const SLIDE_DURATION = 3000;  // ms each image is fully visible
const FADE_DURATION  = 800;   // ms crossfade
const SLIDE_INTERVAL = SLIDE_DURATION + FADE_DURATION;
const TOTAL_DURATION = IMAGES.length * SLIDE_INTERVAL; // plays through once, no loop
const FADE_OUT_START = TOTAL_DURATION;                 // starts fading after last slide
const DONE_DELAY     = FADE_OUT_START + 600;

export default function SplashScreen({ onDone }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading]       = useState(false);

  // Advance through images once — stop at the last one, never loop back
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      if (idx >= IMAGES.length) {
        clearInterval(interval); // hold on last image, no loop → no glitch
        return;
      }
      setActiveIdx(idx);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Fade out the whole splash then hand off to the app
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
