import { motion, AnimatePresence } from "framer-motion";
import type { Horse } from "./types";
import { Silks } from "./Silks";
import { HorseIcon } from "./HorseIcon";
import { useMemo } from "react";

const POSITION_LABEL = ["1ST", "2ND", "3RD"];
const POSITION_COLOR = [
  "linear-gradient(135deg, oklch(0.92 0.17 90), oklch(0.65 0.14 75))",
  "linear-gradient(135deg, oklch(0.88 0.01 250), oklch(0.6 0.01 250))",
  "linear-gradient(135deg, oklch(0.72 0.13 50), oklch(0.45 0.1 45))",
];

export function WinnerPanel({
  horses,
  finished,
  mode = "predictor",
  placedCutoffPosition = 3,
}: {
  horses: Horse[];
  finished: boolean;
  mode?: "predictor" | "results";
  placedCutoffPosition?: number;
}) {
  const ordered = useMemo(() => {
    const sorted = [...horses].sort((a, b) => a.finalPosition - b.finalPosition);
    if (mode === "results") {
      return sorted.filter((h) => h.finalPosition <= Math.max(1, Math.floor(placedCutoffPosition || 1)));
    }
    const tip = sorted.find((h) => h.isTip);
    const fav = sorted.find((h) => h.isFavourite);
    return [tip ?? fav ?? sorted[0]].filter(Boolean) as Horse[];
  }, [horses, mode, placedCutoffPosition]);
  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence>
        {finished &&
          ordered.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: i === 0 ? 1 : 0.92 }}
              transition={{ delay: 0.4 + i * 0.18, type: "spring", damping: 18 }}
              className="rounded-xl border border-border overflow-hidden bg-card"
              style={{
                boxShadow:
                  i === 0
                    ? "0 0 30px oklch(0.82 0.16 85 / 0.35), var(--shadow-card)"
                    : "var(--shadow-card)",
              }}
            >
              {i === 0 && (
                <div className="text-center py-2 text-primary font-black tracking-[0.4em] text-sm border-b border-primary/30 bg-primary/5">
                  {mode === "predictor" ? "OUR PREDICTED WINNER" : "✦ WINNER ✦"}
                </div>
              )}
              <div
                className="relative p-4 flex flex-col items-center"
                style={{
                  background:
                    "radial-gradient(ellipse at top, oklch(0.28 0.06 265), transparent 70%)",
                }}
              >
                <div className="scale-110">
                  <HorseIcon number={h.number} />
                </div>
                <div
                  className="mt-2 px-4 py-1 rounded-full text-xs font-black tracking-widest"
                  style={{ background: POSITION_COLOR[i], color: "oklch(0.18 0.05 265)" }}
                >
                  {POSITION_LABEL[i]}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm font-black text-foreground flex items-center gap-2 justify-center">
                    <Silks
                      primary={h.silkPrimary}
                      secondary={h.silkSecondary}
                      silkUrl={h.silkUrl}
                      size={20}
                    />
                    {h.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground tracking-wider mt-0.5">
                    {h.jockey} • {h.weight}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
      {!finished && (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
          Podium revealed after the race
        </div>
      )}
    </div>
  );
}