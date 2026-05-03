import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Clock, RefreshCcw, Trophy, Play, Info, Wind, Cloud, Timer, MapPin } from "lucide-react";
import { RaceTrack } from "@/components/race/RaceTrack";
import { WinnerPanel } from "@/components/race/WinnerPanel";
import { Podium } from "@/components/race/Podium";
import { HORSES, parseVirtualRacePayload } from "@/components/race/types";

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
  const [runKey, setRunKey] = useState(0);
  const [winnerPanelVisible, setWinnerPanelVisible] = useState(false);
  const [podiumVisible, setPodiumVisible] = useState(false);
  const payload = useMemo(() => {
    if (typeof window === "undefined") return null;
    return parseVirtualRacePayload(window.location.search);
  }, []);
  const controlAction = useMemo(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("control");
  }, []);
  const controlNonce = useMemo(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("nonce");
  }, []);
  const horses = useMemo(
    () =>
      payload?.horses && payload.horses.length > 0
        ? payload.horses
        : HORSES,
    [payload],
  );
  const raceTitle = payload?.race?.title || "Bet Now With Fairplaybet.Co.Uk Handicap";
  const raceMeeting = payload?.race?.meeting || "BATH";
  const raceOffTime = payload?.race?.offTime || "16:10";
  const raceDistance = payload?.race?.distance || "5f160y";
  const runnerCount = payload?.race?.runnerCount || horses.length;
  const raceMode = payload?.race?.mode || "predictor";
  const placedCutoffPosition = Math.max(
    1,
    Math.floor(Number(payload?.race?.placedCutoffPosition ?? 3)),
  );
  const dataQualityTarget = Math.max(
    0,
    Math.min(100, Number(payload?.race?.dataQualityScore ?? 45)),
  );
  const dataQuality = phase === "idle" ? 0 : dataQualityTarget;

  const start = () => {
    // Always force a fresh run on tap so START never feels unresponsive.
    setWinnerPanelVisible(false);
    setPodiumVisible(false);
    setPhase("idle");
    window.setTimeout(() => {
      setRunKey((k) => k + 1);
      setPhase("running");
    }, 40);
  };
  const reset = () => {
    setRunKey((k) => k + 1);
    setPhase("idle");
  };
  const onFinish = () => setPhase("finished");

  useEffect(() => {
    if (phase !== "finished") {
      setWinnerPanelVisible(false);
      setPodiumVisible(false);
      return;
    }
    const winnerTimer = window.setTimeout(() => setWinnerPanelVisible(true), 220);
    const podiumTimer = window.setTimeout(() => setPodiumVisible(true), 520);
    return () => {
      window.clearTimeout(winnerTimer);
      window.clearTimeout(podiumTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (!controlAction) return;
    if (controlAction === "reset") {
      setRunKey((k) => k + 1);
      setPhase("idle");
      return;
    }
    if (controlAction === "start") {
      setWinnerPanelVisible(false);
      setPodiumVisible(false);
      setRunKey((k) => k + 1);
      setPhase("running");
    }
  }, [controlAction, controlNonce]);

  return (
    <main
      className="min-h-screen text-foreground"
      style={{ background: "var(--gradient-bg)" }}
    >
      <div className="max-w-[1400px] mx-auto px-5 py-5">
        {/* Top bar */}
        <header className="mb-4 rounded-xl border border-border bg-card/40 p-3 md:p-0 md:border-0 md:bg-transparent md:rounded-none md:flex md:items-center md:gap-3">
          <button className="hidden md:inline-flex p-2 rounded-lg border border-border hover:bg-muted transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-border bg-card">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <div className="text-2xl font-black leading-none">{raceOffTime}</div>
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground mt-0.5">{raceMeeting}</div>
            </div>
          </div>
          <div className="mt-2 md:mt-0 md:flex-1 min-w-0">
            <h1 className="text-base sm:text-lg md:text-2xl font-black tracking-tight leading-tight break-words">
              {raceTitle}
            </h1>
            <p className="text-[11px] md:text-xs text-muted-foreground tracking-wider">
              {raceDistance} &nbsp;|&nbsp; {runnerCount} runners
            </p>
          </div>
          <div className="mt-3 md:mt-0 flex items-center gap-2 md:ml-auto">
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:bg-muted transition text-xs md:text-sm font-bold tracking-widest"
            >
              <RefreshCcw className="w-3.5 h-3.5 md:w-4 md:h-4" /> RESET
            </button>
            <button
              onClick={start}
              className="flex items-center gap-1.5 px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-black tracking-widest text-xs md:text-sm"
              style={{
                background: "var(--gradient-gold)",
                color: "oklch(0.18 0.05 265)",
                boxShadow: "var(--shadow-gold)",
              }}
            >
              <Play className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
              START
            </button>
          </div>
        </header>

        {/* Data quality bar */}
        <div className="rounded-xl border border-border bg-card px-4 py-2.5 mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground font-bold">DATA QUALITY</span>
            <span className="text-xs font-black text-emerald-400">{phase === "idle" ? "Pending" : "Good"}</span>
            <Info className="w-3 h-3 text-muted-foreground" />
          </div>
          <div className="flex-1 h-2 rounded-full relative overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.6 0.22 25), oklch(0.78 0.18 60), oklch(0.85 0.18 90), oklch(0.75 0.18 145), oklch(0.7 0.16 220))",
            }}
          >
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-foreground"
              style={{ left: `${dataQuality}%` }}
            />
          </div>
          <div className="text-right shrink-0">
            <div className="text-sm font-black">{dataQuality}%</div>
            <div className="text-[10px] tracking-widest text-primary">Fair Odds</div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
          <RaceTrack
            key={runKey}
            horses={horses}
            running={phase === "running"}
            finished={phase === "finished"}
            mode={raceMode}
            placedCutoffPosition={placedCutoffPosition}
            onFinish={onFinish}
          />
          <aside>
            <WinnerPanel
              horses={horses}
              finished={winnerPanelVisible}
              mode={raceMode}
              placedCutoffPosition={placedCutoffPosition}
            />
          </aside>
        </div>

        {/* Podium */}
        {!(raceMode === "predictor" && phase === "finished") && (
          <div className="mt-4">
            <Podium horses={horses} finished={podiumVisible} />
          </div>
        )}

        {/* Footer stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 rounded-xl border border-border bg-card px-6 py-3 grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          <Stat icon={<MapPin className="w-4 h-4" />} label="TRACK" value="Good" />
          <Stat icon={<Wind className="w-4 h-4" />} label="GOING" value="Good to Firm" />
          <Stat icon={<Cloud className="w-4 h-4" />} label="WEATHER" value="Cloudy 18°C" />
          <Stat icon={<Trophy className="w-4 h-4" />} label="STARTED" value={`${runnerCount} Runners`} />
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
