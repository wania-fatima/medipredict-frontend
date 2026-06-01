const riskConfig = {
  LOW:    { color: '#22c55e', bg: '#0f2d1a', border: '#22c55e44', emoji: '✅', label: 'Low Risk' },
  MEDIUM: { color: '#f59e0b', bg: '#2d1f0a', border: '#f59e0b44', emoji: '⚠️', label: 'Medium Risk' },
  HIGH:   { color: '#ef4444', bg: '#2d0f0f', border: '#ef444444', emoji: '🚨', label: 'High Risk' },
};

export default function ResultCard({ result }) {
  const cfg = riskConfig[result.risk_level];
  const pct = result.risk_percentage;

  const radius = 80;
  const cx = 110, cy = 110;
  const startAngle = -210;
  const endAngle   = 30;
  const totalAngle = endAngle - startAngle;
  const fillAngle  = startAngle + (totalAngle * pct) / 100;

  const toRad = deg => (deg * Math.PI) / 180;
  const arcPath = (start, end) => {
    const s = { x: cx + radius * Math.cos(toRad(start)), y: cy + radius * Math.sin(toRad(start)) };
    const e = { x: cx + radius * Math.cos(toRad(end)),   y: cy + radius * Math.sin(toRad(end)) };
    const large = Math.abs(end - start) > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  return (
    <div style={{
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      borderTop: `3px solid ${cfg.color}`,
      borderRadius: '16px',
      padding: '28px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>{cfg.emoji}</div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: cfg.color, margin: 0 }}>
          {cfg.label}
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
          {result.prediction === 1 ? 'Diabetes risk detected' : 'No diabetes detected'}
        </p>
      </div>

      {/* Gauge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <svg width="220" height="140" viewBox="0 0 220 140">
          <path d={arcPath(startAngle, endAngle)}
            fill="none" stroke="#1e3a5f" strokeWidth="14" strokeLinecap="round" />
          <path d={arcPath(startAngle, fillAngle)}
            fill="none" stroke={cfg.color} strokeWidth="14" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${cfg.color}88)` }} />
          <text x="28"  y="120" fill="#22c55e" fontSize="10" fontFamily="monospace">LOW</text>
          <text x="88"  y="42"  fill="#f59e0b" fontSize="10" fontFamily="monospace">MED</text>
          <text x="162" y="120" fill="#ef4444" fontSize="10" fontFamily="monospace">HIGH</text>
          <text x={cx} y={cy + 8} fill={cfg.color}
            fontSize="28" fontWeight="800"
            textAnchor="middle" fontFamily="monospace">
            {pct}%
          </text>
          <text x={cx} y={cy + 26} fill="#475569"
            fontSize="11" textAnchor="middle" fontFamily="sans-serif">
            diabetes risk
          </text>
        </svg>
      </div>

      {/* Advice */}
      <div style={{
        background: '#0b1120',
        border: `1px solid ${cfg.border}`,
        borderRadius: '10px', padding: '16px 20px', marginBottom: '16px',
      }}>
        <div style={{
          fontSize: '10px', color: cfg.color, fontFamily: 'monospace',
          fontWeight: '700', letterSpacing: '1px', marginBottom: '8px',
        }}>CLINICAL ADVICE</div>
        <p style={{ margin: '0 0 8px', color: '#e2e8f0', fontSize: '14px', lineHeight: '1.6' }}>
          {result.advice}
        </p>
        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
          ⏰ {result.urgency}
        </p>
      </div>

      {/* Disclaimer */}
      <div style={{
        background: '#1a1a2e', border: '1px solid #2a2a4a',
        borderRadius: '8px', padding: '12px 16px',
      }}>
        <p style={{ margin: 0, color: '#475569', fontSize: '12px', lineHeight: '1.6' }}>
          ⚕️ <strong style={{ color: '#64748b' }}>Medical Disclaimer:</strong> {result.disclaimer}
        </p>
      </div>
    </div>
  );
}