import { useRef, useState, useEffect } from 'react';

/**
 * Scales children to fill the container width.
 * Uses position:absolute on the inner card so its 390px layout width
 * never bleeds into the parent grid — only the scaled visual output shows.
 */
export default function ScaledCard({ children }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [dims, setDims] = useState({ height: 0, scale: 1 });

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    function update() {
      const outerW = outer.offsetWidth;
      const innerW = inner.offsetWidth;
      const innerH = inner.offsetHeight;
      if (!innerW || !innerH) return;
      const scale = outerW / innerW;
      setDims({ height: Math.ceil(innerH * scale), scale });
    }

    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div
      ref={outerRef}
      style={{ width: '100%', height: dims.height, position: 'relative', overflow: 'visible' }}
    >
      <div
        ref={innerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: 'top left',
          transform: `scale(${dims.scale})`,
          display: 'inline-block',
        }}
      >
        {children}
      </div>
    </div>
  );
}
