type Props = { primary: string; secondary: string; silkUrl?: string; size?: number };

export function Silks({ primary, secondary, silkUrl, size = 40 }: Props) {
  if (silkUrl && silkUrl.trim().length > 0) {
    return (
      <div
        className="rounded-md overflow-hidden border"
        style={{
          width: size,
          height: size,
          borderColor: "oklch(0.82 0.16 85 / 0.4)",
          background: "oklch(0.21 0.055 265)",
        }}
      >
        <img
          src={silkUrl}
          alt="Silks"
          width={size}
          height={size}
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="rounded-md overflow-hidden">
      <defs>
        <clipPath id={`clip-${primary}-${secondary}`}>
          <rect width="40" height="40" rx="4" />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${primary}-${secondary})`}>
        <rect width="40" height="40" fill={primary} />
        <polygon points="0,0 40,0 40,40" fill={secondary} opacity="0.85" />
        <rect x="16" y="0" width="8" height="40" fill={secondary} opacity="0.6" />
        <circle cx="20" cy="20" r="4" fill={primary} stroke={secondary} strokeWidth="1.5" />
      </g>
      <rect width="40" height="40" rx="4" fill="none" stroke="oklch(0.82 0.16 85 / 0.4)" strokeWidth="1" />
    </svg>
  );
}