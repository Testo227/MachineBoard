import React from 'react';

const LiveCursors = ({ remoteCursors, currentUserId }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      {Object.entries(remoteCursors).map(([userId, presenceArr]) => {
        if (userId === currentUserId) return null;
        const p = presenceArr?.[0];
        if (!p || p.x < 0) return null;

        const x = p.x * window.innerWidth;
        const y = p.y * window.innerHeight;

        return (
          <div
            key={userId}
            style={{
              position: 'fixed',
              left: x,
              top: y,
              pointerEvents: 'none',
              transition: 'left 0.05s linear, top 0.05s linear',
            }}
          >
            {/* Cursor arrow */}
            <svg
              width="14"
              height="18"
              viewBox="0 0 14 18"
              fill="none"
              style={{ position: 'absolute', left: 0, top: 0 }}
            >
              <path
                d="M0 0L0 14L3.9 9.9L6.1 16L8.1 15.2L5.9 9L11 9L0 0Z"
                fill={p.color}
                stroke="white"
                strokeWidth="1.2"
              />
            </svg>

            {/* Avatar bubble */}
            <div
              style={{
                position: 'absolute',
                left: 10,
                top: -9,
                backgroundColor: p.color,
                width: 20,
                height: 20,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
              }}
            >
              <span style={{ color: 'white', fontSize: 8, fontWeight: 700, lineHeight: 1 }}>
                {p.initials}
              </span>
            </div>

            {/* Name label */}
            <div
              style={{
                position: 'absolute',
                left: 32,
                top: -7,
                backgroundColor: p.color,
                color: 'white',
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 4,
                whiteSpace: 'nowrap',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}
            >
              {p.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LiveCursors;
