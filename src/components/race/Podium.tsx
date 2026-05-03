import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import type { Horse } from "./types";
import { Silks } from "./Silks";
import { useMemo } from "react";

const LABELS = ["1ST", "2ND", "3RD", "4TH", "5TH", "6TH"];

export function Podium({ horses, finished }: { horses: Horse[]; finished: boolean }) {
  const ordered = useMemo(() => [...horses].sort((a, b) => a.finalPosition - b.finalPosition), [horses]);
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-black tracking-[0.3em] text-primary">RACE RESULT PODIUM</h3>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <AnimatePresence>
          {ordered.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 20 }}
              animate={finished ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 0 }}
              transition={{ delay: finished ? 0.6 + i * 0.08 : 0 }}
              className="rounded-xl border p-3 relative overflow-hidden"
              style={{
                borderColor: i === 0 ? "oklch(0.82 0.16 85)" : "oklch(0.32 0.05 265)",
                background:
                  i === 0
                    ? "linear-gradient(180deg, oklch(0.82 0.16 85 / 0.15), oklch(0.21 0.055 265))"
                    : "oklch(0.21 0.055 265)",
                boxShadow: i === 0 ? "0 0 18px oklch(0.82 0.16 85 / 0.3)" : undefined,
              }}
            >
              <div
                className="text-[10px] font-black tracking-[0.2em] mb-2"
                style={{ color: i < 3 ? "oklch(0.82 0.16 85)" : "oklch(0.72 0.03 250)" }}
              >
                {LABELS[i]}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-black"
                  style={{ background: h.silkPrimary, color: "oklch(0.98 0 0)" }}
                >
                  {h.number}
                </div>
                <div className="text-[12px] font-bold text-foreground truncate">{h.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <Silks
                  primary={h.silkPrimary}
                  secondary={h.silkSecondary}
                  silkUrl={h.silkUrl}
                  size={28}
                />
                <div className="text-[11px]">
                  <span className="text-muted-foreground">Score:</span>{" "}
                  <span className="font-black text-primary">{h.score}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}