type Props = { position: number; size?: number };

const STYLES: Record<number, { bg: string; ring: string; text: string }> = {
  1: { bg: "linear-gradient(135deg, oklch(0.92 0.17 90), oklch(0.65 0.14 75))", ring: "oklch(0.92 0.17 90)", text: "oklch(0.18 0.05 265)" },
  2: { bg: "linear-gradient(135deg, oklch(0.88 0.01 250), oklch(0.6 0.01 250))", ring: "oklch(0.88 0.01 250)", text: "oklch(0.18 0.05 265)" },
  3: { bg: "linear-gradient(135deg, oklch(0.72 0.13 50), oklch(0.45 0.1 45))", ring: "oklch(0.72 0.13 50)", text: "oklch(0.98 0.01 90)" },
};

export function PositionMedal({ position, size = 44 }: Props) {
  const top = STYLES[position];
  if (top) {
    return (
      <div
        className="flex items-center justify-center rounded-full font-black shadow-lg"
        style={{
          width: size, height: size,
          background: top.bg,
          color: top.text,
          boxShadow: `0 0 18px ${top.ring}55, inset 0 1px 0 rgba(255,255,255,0.4)`,
          border: `2px solid ${top.ring}`,
          fontSize: size * 0.45,
        }}
      >
        {position}
      </div>
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-full font-black"
      style={{
        width: size, height: size,
        background: "oklch(0.82 0.16 85 / 0.15)",
        color: "oklch(0.82 0.16 85)",
        border: "2px solid oklch(0.82 0.16 85 / 0.5)",
        fontSize: size * 0.45,
      }}
    >
      {position}
    </div>
  );
}