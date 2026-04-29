import horseCyan from "@/assets/horse-cyan.png";
import horsePink from "@/assets/horse-pink.png";
import horseGreen from "@/assets/horse-green.png";
import horseBlue from "@/assets/horse-blue.png";
import horseRed from "@/assets/horse-red.png";
import horseMaroon from "@/assets/horse-maroon.png";

const SPRITES: Record<number, { src: string; flip: boolean }> = {
  4: { src: horseCyan, flip: true },
  3: { src: horsePink, flip: false },
  1: { src: horseGreen, flip: true },   // generated facing left → mirror
  5: { src: horseBlue, flip: true },
  6: { src: horseRed, flip: true },
  2: { src: horseMaroon, flip: true },
};

type Props = { number: number };

export function HorseIcon({ number }: Props) {
  const sprite = SPRITES[number] ?? SPRITES[4];
  return (
    <img
      src={sprite.src}
      alt={`Horse ${number}`}
      width={120}
      height={120}
      loading="lazy"
      className="select-none drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]"
      style={{
        width: 120,
        height: 120,
        objectFit: "contain",
        transform: sprite.flip ? "scaleX(-1)" : undefined,
        imageRendering: "auto",
      }}
      draggable={false}
    />
  );
}
