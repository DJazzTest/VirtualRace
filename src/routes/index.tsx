import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Clock, RefreshCcw, Trophy, Play, Info, Wind, Cloud, Timer, MapPin } from "lucide-react";
import { RaceTrack } from "@/components/race/RaceTrack";
import { WinnerPanel } from "@/components/race/WinnerPanel";
import { Podium } from "@/components/race/Podium";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Bath 16:10 — Race Animation" },
      { name: "description", content: "Live horse race animation with podium reveal" },
    ],
  }),
});

type Phase = "idle" | "running" | "finished";

function Index() {
  const [phase, setPhase] = useState<Phase>("idle");

  const start = () => setPhase("running");
  const reset = () => setPhase("idle");
  const onFinish = () => setPhase("finished");

  return (
    <main
      className="min-h-screen text-foreground"
      style={{ background: "var(--gradient-bg)" }}
    >
      <div className="max-w-[1400px] mx-auto px-5 py-5">
        {/* Top bar */}
        <header className="flex items-center gap-3 mb-4">
          <button className="p-2 rounded-lg border border-border hover:bg-muted transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-border bg-card">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <div className="text-2xl font-black leading-none">16:10</div>
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground mt-0.5">BATH</div>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-black tracking-tight">
              Bet Now With Fairplaybet.Co.Uk Handicap
            </h1>
            <p className="text-xs text-muted-foreground tracking-wider">
              5f160y &nbsp;|&nbsp; 6 runners
            </p>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition text-sm font-bold tracking-widest"
          >
            <RefreshCcw className="w-4 h-4" /> RESET
          </button>
          <button
            onClick={phase === "idle" ? start : reset}
            disabled={phase === "running"}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-black tracking-widest text-sm disabled:opacity-60"
            style={{
              background: "var(--gradient-gold)",
              color: "oklch(0.18 0.05 265)",
              boxShadow: "var(--shadow-gold)",
            }}
          >
            {phase === "finished" ? (
              <><Trophy className="w-4 h-4" /> RESULT</>
            ) : (
              <><Play className="w-4 h-4 fill-current" /> {phase === "running" ? "RACING…" : "START"}</>
            )}
          </button>
        </header>

        {/* Data quality bar */}
        <div className="rounded-xl border border-border bg-card px-4 py-2.5 mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground font-bold">DATA QUALITY</span>
            <span className="text-xs font-black text-emerald-400">Good</span>
            <Info className="w-3 h-3 text-muted-foreground" />
          </div>
          <div className="flex-1 h-2 rounded-full relative overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.6 0.22 25), oklch(0.78 0.18 60), oklch(0.85 0.18 90), oklch(0.75 0.18 145), oklch(0.7 0.16 220))",
            }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-foreground" style={{ left: "70%" }} />
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-black">45%</div>
            <div className="text-[10px] tracking-widest text-primary">Fair Odds</div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
          <RaceTrack running={phase === "running"} finished={phase === "finished"} onFinish={onFinish} />
          <aside>
            <WinnerPanel finished={phase === "finished"} />
          </aside>
        </div>

        {/* Podium */}
        <div className="mt-4">
          <Podium finished={phase === "finished"} />
        </div>

        {/* Footer stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 rounded-xl border border-border bg-card px-6 py-3 grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          <Stat icon={<MapPin className="w-4 h-4" />} label="TRACK" value="Good" />
          <Stat icon={<Wind className="w-4 h-4" />} label="GOING" value="Good to Firm" />
          <Stat icon={<Cloud className="w-4 h-4" />} label="WEATHER" value="Cloudy 18°C" />
          <Stat icon={<Trophy className="w-4 h-4" />} label="STARTED" value="6 Runners" />
          <Stat icon={<Timer className="w-4 h-4" />} label="DURATION" value="1:02.34" />
        </motion.div>
      </div>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-primary">{icon}</div>
      <div>
        <div className="text-[10px] tracking-[0.25em] text-muted-foreground font-bold">{label}</div>
        <div className="text-sm font-bold">{value}</div>
      </div>
    </div>
  );
}
