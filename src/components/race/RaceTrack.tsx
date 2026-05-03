import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Crown, Sparkles } from "lucide-react";
import type { Horse } from "./types";
import { Silks } from "./Silks";
import { PositionMedal } from "./PositionMedal";
import { HorseIcon } from "./HorseIcon";

type Props = {
  horses: Horse[];
  running: boolean;
  finished: boolean;
  mode?: "predictor" | "results";
  placedCutoffPosition?: number;
  onFinish: () => void;
};

const RACE_DURATION = 4.5; // seconds
const LANE_HEIGHT = 78;

export function RaceTrack({
  horses,
  running,
  finished,
  mode = "predictor",
  placedCutoffPosition = 3,
  onFinish,
}: Props) {
  const [crossed, setCrossed] = useState<Set<number>>(new Set());
  const laneOrder = useMemo(
    () => [...horses].sort((a, b) => a.finalPosition - b.finalPosition),
    [horses],
  );

  useEffect(() => {
    if (!running) {
      setCrossed(new Set());
      return;
    }
    // Schedule cross events based on finish offsets
    const timers: ReturnType<typeof setTimeout>[] = [];
    laneOrder.forEach((h) => {
      const delay = (RACE_DURATION + (h.finalPosition - 1) * 0.18) * 1000;
      timers.push(
        setTimeout(() => {
          setCrossed((prev) => new Set(prev).add(h.id));
        }, delay)
      );
    });
    timers.push(setTimeout(onFinish, (RACE_DURATION + laneOrder.length * 0.18 + 0.4) * 1000));
    return () => timers.forEach(clearTimeout);
  }, [running, onFinish, laneOrder]);

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
          className="absolute top-0 bottom-0 z-20 pointer-events-none flex items-center"
          style={{
            right: "10px",
            boxShadow: "0 0 25px oklch(0.82 0.16 85 / 0.35)",
          }}
        >
          <div
            className="h-full w-[9px]"
            style={{
              backgroundImage:
                "repeating-conic-gradient(oklch(0.98 0 0) 0% 25%, oklch(0.1 0 0) 0% 50%)",
              backgroundSize: "9px 9px",
              borderLeft: "1px solid oklch(0.08 0 0 / 0.6)",
              borderRight: "1px solid oklch(0.08 0 0 / 0.6)",
            }}
          />
          <div
            className="h-full w-[14px] flex items-center justify-center"
            style={{
              background: "oklch(0.12 0.02 35 / 0.92)",
              borderLeft: "1px solid oklch(0.9 0.02 90 / 0.15)",
            }}
          >
            <div
              className="flex flex-col items-center justify-center text-white font-black leading-none"
              style={{ fontSize: "9px", letterSpacing: "0.02em", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
            >
              <span>F</span>
              <span>I</span>
              <span>N</span>
              <span>I</span>
              <span>S</span>
              <span>H</span>
            </div>
          </div>
        </div>

        {laneOrder.map((h) => {
          const hasCrossed = crossed.has(h.id);
          // travel time: winner fastest
          const travelTime = RACE_DURATION + (h.finalPosition - 1) * 0.18;
          const shouldShowHorseAfterFinish =
            mode === "results"
              ? h.finalPosition <= Math.max(1, Math.floor(placedCutoffPosition || 1))
              : (h.isTip ?? h.finalPosition === 1);
          return (
            <div
              key={h.id}
              className="relative flex items-center gap-1 md:gap-3 my-2 rounded-lg pr-0 md:pr-16"
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
                      className="w-8 h-8 md:w-[42px] md:h-[42px] rounded-md flex items-center justify-center font-black text-sm md:text-lg border-2"
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
              <div className="hidden md:block shrink-0">
                <Silks
                  primary={h.silkPrimary}
                  secondary={h.silkSecondary}
                  silkUrl={h.silkUrl}
                  size={42}
                />
              </div>

              {/* Info */}
              <div className="hidden md:block w-44 shrink-0 z-10">
                <div className="text-[13px] font-bold text-foreground flex items-center gap-2">
                  <span className="text-muted-foreground">({h.number})</span>
                  <span className="truncate">{h.name}</span>
                  {h.isTip && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-500 text-white">
                      TIP
                    </span>
                  )}
                  {h.isFavourite && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-black">
                      FAV
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground tracking-wider">
                  {h.jockey} • {h.weight}
                </div>
              </div>

              {/* Lane (track for the horse) */}
              <div className="relative flex-1 h-full overflow-hidden">
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
                {(!finished || (finished && shouldShowHorseAfterFinish)) && (
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: "20px" }}
                    initial={{ x: 0 }}
                    animate={{
                      x: running || finished ? "calc(100% + 560px)" : 0,
                      y: running && !hasCrossed ? [0, -2, 0, 2, 0] : 0,
                    }}
                    transition={{
                      x: {
                        duration: travelTime,
                        ease: [0.25, 0.1, 0.25, 1],
                      },
                      y: { duration: 0.25, repeat: running ? Infinity : 0, ease: "easeInOut" },
                    }}
                  >
                    <motion.div
                      animate={{
                        rotate: running ? [0, 2, -2, 0] : 0,
                      }}
                      transition={{
                        rotate: { duration: 0.15, repeat: running ? Infinity : 0, ease: "easeInOut" },
                      }}
                    >
                      <HorseIcon number={h.number} />
                    </motion.div>
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
                )}
              </div>

              {/* Odds */}
              <div
                className={`${running ? "hidden" : "block"} md:hidden ml-1 px-2 py-0.5 rounded-md font-bold text-[11px] border shrink-0`}
                style={{
                  background: "oklch(0.16 0.05 265 / 0.95)",
                  borderColor: "oklch(0.82 0.16 85 / 0.4)",
                  color: "oklch(0.95 0.05 90)",
                }}
              >
                {String(h.odds || "—").trim() || "—"}
              </div>
              <div
                className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 z-30 px-2.5 py-1 rounded-md font-bold text-[12px] border"
                style={{
                  background: "oklch(0.16 0.05 265 / 0.95)",
                  borderColor: "oklch(0.82 0.16 85 / 0.4)",
                  color: "oklch(0.95 0.05 90)",
                }}
              >
                {String(h.odds || "—").trim() || "—"}
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