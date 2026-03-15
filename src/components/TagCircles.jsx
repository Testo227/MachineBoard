import React, { useState, useEffect, useRef } from "react";

const TagCircles = ({ tags = [], globalTags }) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState(7);

  const validTags = tags
    .map(tagId => globalTags?.find(t => t.id === tagId))
    .filter(Boolean);

  useEffect(() => {
    if (!containerRef.current || !validTags.length) return;
    const measure = () => {
      const w = containerRef.current.clientWidth;
      const n = validTags.length;
      const gap = 2;
      const computed = Math.floor((w - gap * (n - 1)) / n);
      setSize(Math.max(3, Math.min(8, computed)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [validTags.length]);

  if (!validTags.length) return null;

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', gap: 2, width: '100%', alignItems: 'center', height: size, overflow: 'hidden' }}
    >
      {validTags.map(tag => (
        <div
          key={tag.id}
          title={tag.name}
          style={{
            backgroundColor: tag.color.replace("bg-[", "").replace("]", ""),
            borderRadius: '50%',
            width: size,
            height: size,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
};

export default TagCircles;
