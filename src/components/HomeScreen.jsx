import { useState } from 'react';
import styles from './HomeScreen.module.css';
import StickerCard from './StickerCard';
import AwardCard from './AwardCard';
import ScaledCard from './ScaledCard';
import WordMark from './WordMark';

function buildFeed(workouts, awards) {
  const items = [
    ...workouts.map((w) => ({ type: 'workout', id: w.id, date: w.startDate,  data: w })),
    ...awards.map((a)   => ({ type: 'award',   id: a.id, date: a.earnedDate, data: a })),
  ];
  return items.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export default function HomeScreen({ workouts, awards, onSelect }) {
  const feed = buildFeed(workouts, awards);
  const [syncState, setSyncState] = useState('idle'); // idle | syncing | done

  function handleSync() {
    if (syncState !== 'idle') return;
    setSyncState('syncing');
    setTimeout(() => {
      setSyncState('done');
      setTimeout(() => setSyncState('idle'), 2500);
    }, 1800);
  }

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <WordMark size="md" />
          <button
            className={`${styles.syncBtn} ${styles[syncState]}`}
            onClick={handleSync}
            disabled={syncState === 'syncing'}
          >
            {syncState === 'syncing' && <span className={styles.spinner} />}
            {syncState === 'idle'    && '↻ Sync'}
            {syncState === 'syncing' && 'Syncing…'}
            {syncState === 'done'    && '✓ Up to date'}
          </button>
        </div>
        <h1 className={styles.title}>Sessions</h1>
      </header>

      <div className={styles.grid}>
        {feed.map((item) => (
          <button key={item.id} className={styles.cell} onClick={() => onSelect(item)}>
            <ScaledCard>
              {item.type === 'workout'
                ? <StickerCard workout={item.data} />
                : <AwardCard   award={item.data}   />
              }
            </ScaledCard>
          </button>
        ))}
      </div>
    </main>
  );
}
