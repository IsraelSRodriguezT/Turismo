import React from 'react';

export default function CardIndicator({ title, value, trend, icon }) {
  const trendSymbol = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '•';
  return (
    <div className="card-indicator" role="region" aria-label={title} style={{padding:'12px',border:'1px solid var(--color-secondary)',borderRadius:8}}>
      <div style={{fontSize:12,color:'var(--color-secondary)'}}>{title}</div>
      <div style={{fontSize:20,fontWeight:700}}>{value} <span style={{fontSize:12}}>{trendSymbol}</span></div>
    </div>
  );
}
