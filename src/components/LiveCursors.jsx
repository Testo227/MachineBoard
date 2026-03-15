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
              width="12"
              height="15"
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
                left: 8,
                top: -7,
                backgroundColor: p.color,
                width: 16,
                height: 16,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
            >
              <span style={{ color: 'white', fontSize: 6, fontWeight: 700, lineHeight: 1 }}>
                {p.initials}
              </span>
            </div>

            {/* Name label — only shown when a real name exists */}
            {p.name && (
              <div
                style={{
                  position: 'absolute',
                  left: 26,
                  top: -5,
                  backgroundColor: p.color,
                  color: 'white',
                  fontSize: 9,
                  fontWeight: 600,
                  padding: '1px 5px',
                  borderRadius: 3,
                  whiteSpace: 'nowrap',
                  opacity: 0.85,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }}
              >
                {p.name}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LiveCursors;
