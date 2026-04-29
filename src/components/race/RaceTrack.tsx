import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Crown, Sparkles } from "lucide-react";
import { HORSES } from "./types";
import { Silks } from "./Silks";
import { PositionMedal } from "./PositionMedal";
import { HorseIcon } from "./HorseIcon";

type Props = {
  running: boolean;
  finished: boolean;
  onFinish: () => void;
};

const RACE_DURATION = 4.5; // seconds
const LANE_HEIGHT = 78;

// Order rendered top→bottom matches the screenshot (winner first)
const LANE_ORDER = [...HORSES].sort((a, b) => a.finalPosition - b.finalPosition);

export function RaceTrack({ running, finished, onFinish }: Props) {
  const [crossed, setCrossed] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!running) {
      setCrossed(new Set());
      return;
    }
    // Schedule cross events based on finish offsets
    const timers: ReturnType<typeof setTimeout>[] = [];
    LANE_ORDER.forEach((h) => {
      const delay = (RACE_DURATION + (h.finalPosition - 1) * 0.18) * 1000;
      timers.push(
        setTimeout(() => {
          setCrossed((prev) => new Set(prev).add(h.id));
        }, delay)
      );
    });
    timers.push(setTimeout(onFinish, (RACE_DURATION + LANE_ORDER.length * 0.18 + 0.4) * 1000));
    return () => timers.forEach(clearTimeout);
  }, [running, onFinish]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-border"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.22 0.05 265) 0%, oklch(0.16 0.05 265) 30%, oklch(0.32 0.06 55) 35%, oklch(0.22 0.05 50) 100%)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Header */}
      <div className="relative z-10 pt-5 pb-3 text-center">
        <div className="flex items-center justify-center gap-3 text-primary">
          <span className="h-px w-10 bg-primary/50" />
          <Crown className="w-5 h-5" />
          <h2 className="text-2xl font-black tracking-[0.3em]">THE FINISH</h2>
          <Crown className="w-5 h-5" />
          <span className="h-px w-10 bg-primary/50" />
        </div>
        <p className="text-xs tracking-[0.3em] text-muted-foreground mt-1">
          {finished ? "OFFICIAL RESULT" : running ? "RACE IN PROGRESS" : "READY TO RACE"}
        </p>
      </div>

      {/* Track area */}
      <div className="relative px-4 pb-6">
        {/* Finish line */}
        <div
          className="absolute top-0 bottom-0 w-6 z-20 pointer-events-none"
          style={{
            right: "16px",
            backgroundImage:
              "repeating-conic-gradient(oklch(0.98 0 0) 0% 25%, oklch(0.1 0 0) 0% 50%)",
            backgroundSize: "12px 12px",
            opacity: 0.85,
            boxShadow: "0 0 25px oklch(0.82 0.16 85 / 0.4)",
          }}
        />

        {LANE_ORDER.map((h, idx) => {
          const hasCrossed = crossed.has(h.id);
          // travel time: winner fastest
          const travelTime = RACE_DURATION + (h.finalPosition - 1) * 0.18;
          return (
            <div
              key={h.id}
              className="relative flex items-center gap-3 my-2 rounded-lg pr-10"
              style={{ height: LANE_HEIGHT - 10 }}
            >
              {/* Trap number — always visible; swaps to medal when finished */}
              <div className="w-12 flex justify-center shrink-0 relative">
                <AnimatePresence mode="wait">
                  {finished || hasCrossed ? (
                    <motion.div
                      key="medal"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    >
                      <PositionMedal position={h.finalPosition} size={42} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="trap"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-[42px] h-[42px] rounded-md flex items-center justify-center font-black text-lg border-2"
                      style={{
                        background: h.silkPrimary,
                        color: "oklch(0.98 0 0)",
                        borderColor: "oklch(0.82 0.16 85 / 0.6)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                        textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                      }}
                    >
                      {h.number}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Silks */}
              <div className="shrink-0">
                <Silks primary={h.silkPrimary} secondary={h.silkSecondary} size={42} />
              </div>

              {/* Info */}
              <div className="w-44 shrink-0 z-10">
                <div className="text-[13px] font-bold text-foreground flex items-center gap-2">
                  <span className="text-muted-foreground">({h.number})</span>
                  <span className="truncate">{h.name}</span>
                  {h.isTip && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-500 text-white">
                      TIP
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground tracking-wider">
                  {h.jockey} • {h.weight}
                </div>
              </div>

              {/* Lane (track for the horse) */}
              <div className="relative flex-1 h-full">
                {/* Lane line */}
                <div className="absolute inset-x-0 top-1/2 h-px bg-foreground/10" />

                {/* Speed trail */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full origin-left"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${h.silkPrimary})`,
                    boxShadow: `0 0 12px ${h.silkPrimary}`,
                    width: "100%",
                  }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={
                    running || finished
                      ? { scaleX: 1, opacity: 0.7 }
                      : { scaleX: 0, opacity: 0 }
                  }
                  transition={{ duration: travelTime, ease: [0.25, 0.1, 0.25, 1] }}
                />

                {/* Horse */}
                <motion.div
                  className="absolute"
                  style={{ left: 0, top: "calc(50% - 70px)" }}
                  initial={{ x: 0 }}
                  animate={{
                    x: running || finished ? "calc(100% - 110px)" : 0,
                    y: running && !hasCrossed ? [0, -2, 0, 2, 0] : 0,
                  }}
                  transition={{
                    x: { duration: travelTime, ease: [0.25, 0.1, 0.25, 1] },
                    y: { duration: 0.25, repeat: running ? Infinity : 0, ease: "easeInOut" },
                  }}
                >
                  <HorseIcon number={h.number} />
                  {/* Winner glow */}
                  {hasCrossed && h.finalPosition === 1 && (
                    <motion.div
                      className="absolute inset-0 -z-10"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: [0, 1, 0.4], scale: [0.5, 1.6, 1.4] }}
                      transition={{ duration: 1.2 }}
                      style={{
                        background:
                          "radial-gradient(circle, oklch(0.92 0.17 90 / 0.7), transparent 70%)",
                        filter: "blur(12px)",
                      }}
                    />
                  )}
                </motion.div>
              </div>

              {/* Odds */}
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 z-30 px-2.5 py-1 rounded-md font-bold text-[12px] border"
                style={{
                  background: "oklch(0.16 0.05 265 / 0.95)",
                  borderColor: "oklch(0.82 0.16 85 / 0.4)",
                  color: "oklch(0.95 0.05 90)",
                }}
              >
                {h.odds}
              </div>

              {/* Cross-line flash */}
              <AnimatePresence>
                {hasCrossed && (
                  <motion.div
                    className="absolute right-8 top-0 bottom-0 w-1 z-20 pointer-events-none"
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: [0, 1, 0], scaleY: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      background: "oklch(0.98 0.1 90)",
                      boxShadow: "0 0 25px oklch(0.92 0.17 90)",
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* corner sparkle for winner */}
      {finished && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 text-primary"
        >
          <Sparkles className="w-5 h-5" />
        </motion.div>
      )}

      {/* dust overlay */}
      {running && (
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent, oklch(0.45 0.08 55 / 0.35))",
          }}
        />
      )}
    </div>
  );
}