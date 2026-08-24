// Deterministic placeholder "shelf photo" art, generated from a numeric seed.
// Stands in for the real geo-stamped field photo until photo uploads are wired up.
export default function ShelfArt({ seed }) {
  const s = (seed * 97) % 37;
  const bars = [];
  for (let i = 0; i < 9; i++) {
    const h = 14 + ((s + i * 13) % 22);
    bars.push(<rect key={i} x={10 + i * 22} y={132 - h} width="15" height={h} rx="2" fill="#20202A" />);
  }
  const gid = "g" + seed;
  const glowid = "glow" + seed;

  return (
    <svg viewBox="0 0 220 165" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15151B" />
          <stop offset="1" stopColor="#0B0B0F" />
        </linearGradient>
        <radialGradient id={glowid} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#EFE81B" stopOpacity=".30" />
          <stop offset="1" stopColor="#EFE81B" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="220" height="165" fill={`url(#${gid})`} />
      <rect x="0" y="112" width="220" height="53" fill="#0E0E13" />
      <line x1="0" y1="112" x2="220" y2="112" stroke="#23232C" />
      {bars}
      <ellipse cx="150" cy="52" rx="72" ry="52" fill={`url(#${glowid})`} />
      <rect x="112" y="20" width="78" height="62" rx="4" fill="#0A0A0C" stroke="#33333D" />
      <rect x="117" y="25" width="33" height="52" rx="2" fill="#EFE81B" opacity=".82" />
      <rect x="153" y="25" width="33" height="52" rx="2" fill="#F5F0C0" opacity=".55" />
      <rect x="117" y="58" width="33" height="19" rx="1" fill="#0A0A0C" opacity=".28" />
      <rect x="153" y="58" width="33" height="19" rx="1" fill="#0A0A0C" opacity=".28" />
      <rect x="18" y="26" width="52" height="70" rx="3" fill="#141419" stroke="#22222B" />
      <line x1="18" y1="52" x2="70" y2="52" stroke="#22222B" />
      <line x1="18" y1="74" x2="70" y2="74" stroke="#22222B" />
    </svg>
  );
}
