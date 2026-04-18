import { useState } from 'react';
import styles from './OnboardingFlow.module.css';
import WordMark from './WordMark';

// Screen 1 — HealthKit permission
function HealthKitScreen({ onNext }) {
  return (
    <div className={styles.screen}>
      <div className={styles.top}>
        <WordMark size="md" />
      </div>

      <div className={styles.center}>
        <div className={styles.iconWrap}>
          <span className={styles.icon}>⌚</span>
        </div>
        <h1 className={styles.heading}>Connect your Apple Watch</h1>
        <p className={styles.body}>
          StatShot reads your workout data directly from Apple Health —
          duration, calories, heart rate, distance, and achievements.
          Your data never leaves your device.
        </p>

        <div className={styles.permList}>
          {['Workouts', 'Active Calories', 'Heart Rate', 'Distance', 'Activity Rings'].map((item) => (
            <div key={item} className={styles.permRow}>
              <span className={styles.check}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <button className={styles.primary} onClick={onNext}>
          Allow Health Access
        </button>
        <button className={styles.ghost} onClick={onNext}>
          Not Now
        </button>
      </div>
    </div>
  );
}

// Screen 2 — Social handles
function SocialScreen({ onNext }) {
  const [handles, setHandles] = useState({ instagram: '', tiktok: '', snapchat: '' });

  function update(key, val) {
    setHandles((h) => ({ ...h, [key]: val }));
  }

  return (
    <div className={styles.screen}>
      <div className={styles.top}>
        <WordMark size="md" />
      </div>

      <div className={styles.center}>
        <div className={styles.iconWrap}>
          <span className={styles.icon}>📲</span>
        </div>
        <h1 className={styles.heading}>Where do you post?</h1>
        <p className={styles.body}>
          Add your handles so your sticker cards are always ready to share.
        </p>

        <div className={styles.form}>
          {[
            { key: 'instagram', label: 'Instagram', placeholder: '@yourhandle' },
            { key: 'tiktok',    label: 'TikTok',    placeholder: '@yourhandle' },
            { key: 'snapchat',  label: 'Snapchat',  placeholder: '@yourhandle' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className={styles.field}>
              <label className={styles.label}>{label}</label>
              <input
                className={styles.input}
                type="text"
                placeholder={placeholder}
                value={handles[key]}
                onChange={(e) => update(key, e.target.value)}
                autoCorrect="off"
                autoCapitalize="none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <button className={styles.primary} onClick={onNext}>
          Let's Go
        </button>
        <button className={styles.ghost} onClick={onNext}>
          Skip for Now
        </button>
      </div>
    </div>
  );
}

// Orchestrator
export default function OnboardingFlow({ onDone }) {
  const [step, setStep] = useState(0);

  function next() {
    if (step < 1) {
      setStep(step + 1);
    } else {
      onDone();
    }
  }

  return step === 0
    ? <HealthKitScreen onNext={next} />
    : <SocialScreen    onNext={next} />;
}
