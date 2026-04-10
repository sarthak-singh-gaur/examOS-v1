import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif'
});

export default function MermaidChart({ chart }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (chart && containerRef.current) {
      mermaid.render(`mermaid-${Math.random().toString(36).substring(2)}`, chart)
        .then(({ svg }) => {
          if (containerRef.current) {
             containerRef.current.innerHTML = svg;
          }
        })
        .catch(err => {
          console.error("Mermaid Render Error", err);
        });
    }
  }, [chart]);

  if (!chart) return null;

  return (
    <div className="flex justify-center my-6 p-4 bg-white rounded-xl border border-border shadow-sm">
      <div ref={containerRef} className="mermaid-container animate-in zoom-in duration-300 pointer-events-none" />
    </div>
  );
}
