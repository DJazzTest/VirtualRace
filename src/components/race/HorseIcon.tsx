import horseCyan from "@/assets/horse-cyan.png";
import horsePink from "@/assets/horse-pink.png";
import horseGreen from "@/assets/horse-green.png";
import horseBlue from "@/assets/horse-blue.png";
import horseRed from "@/assets/horse-red.png";
import horseMaroon from "@/assets/horse-maroon.png";

const SPRITES: Record<number, { src: string; flip: boolean }> = {
  4: { src: horseCyan, flip: false }, // facing finish line
  3: { src: horsePink, flip: false }, // flipped to face finish line
  1: { src: horseGreen, flip: true }, // horse facing finish line
  5: { src: horseBlue, flip: false }, // flipped to face finish line
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
      width={100}
      height={80}
      loading="lazy"
      className="select-none drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]"
      style={{
        width: 100,
        height: 80,
        objectFit: "contain",
        objectPosition: "center",
        transform: sprite.flip ? "scaleX(-1)" : undefined,
        imageRendering: "auto",
      }}
      draggable={false}
    />
  );
}
