import { useState } from 'react';
import styles from './HomeScreen.module.css';
import StickerCard from './StickerCard';
import AwardCard from './AwardCard';
import ScaledCard from './ScaledCard';
import WordMark from './WordMark';
import { syncedWorkout } from '../data/mockWorkouts';

const TODAY = '2026-04-18';

function isToday(dateStr) {
  return dateStr.startsWith(TODAY);
}

function buildFeed(workouts, awards) {
  return [
    ...workouts.map((w) => ({ type: 'workout', id: w.id, date: w.startDate,  data: w })),
    ...awards.map((a)   => ({ type: 'award',   id: a.id, date: a.earnedDate, data: a })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function Section({ label, items, onSelect }) {
  if (!items.length) return null;
  return (
    <>
      <div className={styles.sectionHeader}>{label}</div>
      <div className={styles.grid}>
        {items.map((item) => (
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
    </>
  );
}

export default function HomeScreen({ workouts, awards, onSelect }) {
  const [extraWorkouts, setExtraWorkouts] = useState([]);
  const [syncState, setSyncState]         = useState('idle');
  const [hasSynced, setHasSynced]         = useState(false);

  const feed = buildFeed([...workouts, ...extraWorkouts], awards);
  const todayItems = feed.filter((i) => isToday(i.date));
  const pastItems  = feed.filter((i) => !isToday(i.date));

  function handleSync() {
    if (syncState !== 'idle') return;
    setSyncState('syncing');
    setTimeout(() => {
      if (!hasSynced) {
        setExtraWorkouts([syncedWorkout]);
        setHasSynced(true);
      }
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
      </header>

      <h1 className={styles.title}>Sessions</h1>

      <Section label="Today"   items={todayItems} onSelect={onSelect} />
      <Section label="Past"    items={pastItems}  onSelect={onSelect} />
    </main>
  );
}
