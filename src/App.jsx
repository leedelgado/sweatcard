import { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import StickerCard from './components/StickerCard';
import AwardCard from './components/AwardCard';
import ScaledCard from './components/ScaledCard';
import { useExport } from './hooks/useExport';
import mockWorkouts from './data/mockWorkouts';
import mockAwards from './data/mockAwards';
import './App.css';

export default function App() {
  // selected = { type: 'workout'|'award', data: {...} }
  const [selected, setSelected] = useState(null);

  const {
    exportSticker, exporting, savedDone,
    copySticker,   copying,   copiedDone,
    error,
  } = useExport();

  if (!selected) {
    return (
      <HomeScreen
        workouts={mockWorkouts}
        awards={mockAwards}
        onSelect={setSelected}
      />
    );
  }

  function handleCopy()   { copySticker(selected.type, selected.data); }
  function handleExport() { exportSticker(selected.type, selected.data); }

  return (
    <main className="app">
      <button className="back-btn" onClick={() => setSelected(null)}>
        ← Back
      </button>

      <ScaledCard>
        {selected.type === 'workout'
          ? <StickerCard workout={selected.data} />
          : <AwardCard   award={selected.data}   />
        }
      </ScaledCard>

      <div className="cta">
        <button
          className="action-btn"
          onClick={handleCopy}
          disabled={copying || exporting}
        >
          {copying ? 'Copying…' : copiedDone ? '✓ Copied!' : 'Copy Sticker'}
        </button>

        <button
          className="action-btn"
          onClick={handleExport}
          disabled={exporting || copying}
        >
          {exporting ? 'Saving…' : savedDone ? '✓ Saved!' : 'Save to Camera Roll'}
        </button>

        {error && <p className="export-error">{error}</p>}

        {(copiedDone || savedDone) && (
          <p className="cta-hint">
            {copiedDone
              ? 'Open Instagram → paste as sticker'
              : 'Open Instagram → Story → sticker icon → Camera Roll'}
          </p>
        )}
      </div>
    </main>
  );
}
