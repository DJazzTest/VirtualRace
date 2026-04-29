type Props = { color: string; secondary: string; number: number };

// Stylized side-view horse + jockey silhouette
export function HorseIcon({ color, secondary, number }: Props) {
  return (
    <svg viewBox="0 0 120 70" width="110" height="64" className="drop-shadow-lg">
      {/* dust */}
      <ellipse cx="20" cy="62" rx="22" ry="3" fill="oklch(0.5 0.05 60 / 0.35)" />
      {/* body */}
      <path
        d="M30 48 Q35 30 60 32 Q82 32 92 38 L100 36 L102 42 L94 46 Q92 54 86 54 L82 50 L70 50 L66 56 L60 56 L58 50 L46 50 L42 56 L36 56 L34 50 Z"
        fill="oklch(0.32 0.07 50)"
        stroke="oklch(0.18 0.04 50)"
        strokeWidth="0.8"
      />
      {/* neck + head */}
      <path d="M92 38 L106 24 L114 22 L116 26 L112 30 L108 30 L102 38 Z" fill="oklch(0.32 0.07 50)" stroke="oklch(0.18 0.04 50)" strokeWidth="0.8" />
      {/* mane */}
      <path d="M94 32 L100 26 L98 34 Z" fill="oklch(0.18 0.04 50)" />
      {/* eye */}
      <circle cx="111" cy="26" r="0.8" fill="oklch(0.1 0 0)" />
      {/* tail */}
      <path d="M30 44 Q20 46 18 54 Q24 50 32 50 Z" fill="oklch(0.18 0.04 50)" />
      {/* jockey body (silks) */}
      <path d="M52 32 Q56 18 66 18 Q76 18 78 30 L74 34 L56 34 Z" fill={color} stroke="oklch(0 0 0 / 0.5)" strokeWidth="0.6" />
      <path d="M52 32 L66 18 L66 34 Z" fill={secondary} opacity="0.85" />
      {/* helmet */}
      <ellipse cx="68" cy="14" rx="6" ry="5" fill={color} stroke="oklch(0 0 0 / 0.5)" strokeWidth="0.6" />
      <ellipse cx="68" cy="14" rx="6" ry="2" fill={secondary} opacity="0.7" />
      {/* number patch */}
      <rect x="60" y="24" width="10" height="8" rx="1.5" fill="oklch(0.18 0.05 265)" />
      <text x="65" y="30.5" textAnchor="middle" fontSize="7" fontWeight="900" fill="oklch(0.97 0.01 90)" fontFamily="system-ui">{number}</text>
    </svg>
  );
}