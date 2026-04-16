import { useState } from 'react';
import { renderCardToCanvas } from '../utils/canvasRenderer';
import { renderAwardToCanvas } from '../utils/awardRenderer';

async function getBlob(type, data) {
  const canvas = type === 'award'
    ? await renderAwardToCanvas(data)
    : await renderCardToCanvas(data);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Canvas export failed'))),
      'image/png'
    );
  });
}

export function useExport() {
  const [exporting, setExporting]   = useState(false);
  const [copying, setCopying]       = useState(false);
  const [savedDone, setSavedDone]   = useState(false);
  const [copiedDone, setCopiedDone] = useState(false);
  const [error, setError]           = useState(null);

  // ── Save to camera roll (Web Share API) / download on desktop ──
  async function exportSticker(type, data) {
    setExporting(true);
    setSavedDone(false);
    setError(null);

    try {
      const blob = await getBlob(type, data);
      const file = new File([blob], 'sweatcard.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'My SweatCard' });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sweatcard.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setSavedDone(true);
      setTimeout(() => setSavedDone(false), 3000);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setExporting(false);
    }
  }

  // ── Copy PNG to clipboard — paste directly into Instagram ──────
  async function copySticker(type, data) {
    setCopying(true);
    setCopiedDone(false);
    setError(null);

    try {
      if (!navigator.clipboard?.write) {
        throw new Error('not_supported');
      }

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': getBlob(type, data) }),
      ]);

      setCopiedDone(true);
      setTimeout(() => setCopiedDone(false), 3000);
    } catch (err) {
      if (err.message === 'not_supported') {
        setError('Clipboard not supported — use Save to Camera Roll instead.');
      } else {
        setError('Copy failed. Try Save to Camera Roll instead.');
      }
    } finally {
      setCopying(false);
    }
  }

  return {
    exportSticker, exporting, savedDone,
    copySticker,   copying,   copiedDone,
    error,
  };
}
