import day1 from "@/assets/race-track-bg/track-day-1.png";
import day2 from "@/assets/race-track-bg/track-day-2.png";
import day3 from "@/assets/race-track-bg/track-day-3.png";
import day4 from "@/assets/race-track-bg/track-day-4.png";
import night1 from "@/assets/race-track-bg/track-night-1.png";
import night2 from "@/assets/race-track-bg/track-night-2.png";
import night3 from "@/assets/race-track-bg/track-night-3.png";
import night4 from "@/assets/race-track-bg/track-night-4.png";

const TRACK_DAY = [day1, day2, day3, day4] as const;
const TRACK_NIGHT = [night1, night2, night3, night4] as const;

const LONDON_TZ = "Europe/London";
/** UK wall-clock: day art 06:00–16:59; night from 17:00. */
const DAY_START_MINUTES = 6 * 60;
const DAY_END_MINUTES = 17 * 60;

function fnv1a32(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickVariant<T extends readonly string[]>(pool: T, seed: string): T[number] {
  const idx = pool.length ? fnv1a32(seed) % pool.length : 0;
  return pool[idx]!;
}

export function londonWallClockMinutes(nowMs = Date.now()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TZ,
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date(nowMs));
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

export function isUkDayMeetingWallClock(nowMs = Date.now()): boolean {
  const m = londonWallClockMinutes(nowMs);
  return m >= DAY_START_MINUTES && m < DAY_END_MINUTES;
}

export type RaceTrackTone = "day" | "night";

export function selectRaceTrackBackground(options: {
  seed?: string | null;
  nowMs?: number;
}): { url: string; tone: RaceTrackTone } {
  const day = isUkDayMeetingWallClock(options.nowMs ?? Date.now());
  const seed = String(options.seed ?? "default");
  if (day) {
    return { url: pickVariant(TRACK_DAY, seed), tone: "day" };
  }
  return { url: pickVariant(TRACK_NIGHT, seed), tone: "night" };
}

export function raceTrackBackgroundImageLayers(trackPhotoUrl: string, tone: RaceTrackTone): string {
  if (tone === "night") {
    return [
      "linear-gradient(180deg, oklch(0.06 0.05 265 / 0.55) 0%, oklch(0.05 0.04 265 / 0.12) 30%, transparent 48%, oklch(0.05 0.04 265 / 0.45) 100%)",
      "radial-gradient(ellipse 65% 55% at 22% 18%, oklch(0.95 0.1 95 / 0.18), transparent 58%)",
      "radial-gradient(ellipse 65% 55% at 78% 16%, oklch(0.93 0.1 95 / 0.16), transparent 58%)",
      "radial-gradient(ellipse 90% 45% at 50% 0%, oklch(0.55 0.06 250 / 0.12), transparent 50%)",
      "linear-gradient(180deg, transparent 35%, oklch(0.12 0.06 150 / 0.2) 100%)",
      `url(${trackPhotoUrl})`,
    ].join(", ");
  }
  return [
    "linear-gradient(180deg, oklch(0.96 0.02 250 / 0.42) 0%, oklch(0.72 0.04 250 / 0.12) 32%, transparent 52%, oklch(0.08 0.04 265 / 0.55) 100%)",
    "radial-gradient(ellipse 70% 60% at 24% 20%, oklch(0.99 0.02 95 / 0.45), transparent 58%)",
    "radial-gradient(ellipse 70% 60% at 76% 18%, oklch(0.98 0.02 95 / 0.38), transparent 58%)",
    "linear-gradient(180deg, transparent 38%, oklch(0.14 0.05 150 / 0.45) 100%)",
    `url(${trackPhotoUrl})`,
  ].join(", ");
}
