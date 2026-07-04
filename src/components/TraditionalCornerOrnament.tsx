import React from 'react';

export function TraditionalCornerOrnament() {
  return (
    <svg className="absolute top-0 right-0 w-8 h-8 text-amber-500/20 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
      <polygon points="100,0 100,100 0,0" />
      <line x1="100" y1="20" x2="80" y2="0" stroke="#D4AF37" strokeWidth="4" />
      <line x1="100" y1="40" x2="60" y2="0" stroke="#D4AF37" strokeWidth="2" />
    </svg>
  );
}
