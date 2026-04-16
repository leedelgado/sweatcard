import { useRef, useState, useEffect } from 'react';

/**
 * Renders children at their natural size, then scales them down
 * to fill the container width — while telling the layout exactly
 * how tall the result is so nothing overlaps.
 */
export default function ScaledCard({ children }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [style, setStyle] = useState({ height: 'auto' });

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    function update() {
      const outerW = outer.offsetWidth;
      const innerW = inner.offsetWidth;  // card's natural width (390px)
      if (!innerW) return;
      const scale = outerW / innerW;
      const scaledH = inner.offsetHeight * scale;
      setStyle({ height: scaledH });
      inner.style.transform = `scale(${scale})`;
    }

    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    return () => ro.disconnect();
  }, [children]);

  return (
    <div ref={outerRef} style={{ width: '100%', ...style, overflow: 'visible' }}>
      <div ref={innerRef} style={{ transformOrigin: 'top left', display: 'inline-block' }}>
        {children}
      </div>
    </div>
  );
}
