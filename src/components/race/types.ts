export type Horse = {
  id: number;
  number: number;
  name: string;
  jockey: string;
  weight: number;
  odds: string;
  silkPrimary: string;
  silkSecondary: string;
  silkUrl?: string;
  finalPosition: number; // 1 = winner
  score: number;
  isTip?: boolean;
  isFavourite?: boolean;
};

export type VirtualRacePayload = {
  race?: {
    offTime?: string;
    meeting?: string;
    title?: string;
    distance?: string;
    runnerCount?: number;
    dataQualityScore?: number;
    mode?: "predictor" | "results";
    placedCutoffPosition?: number;
    raceId?: string | number;
    raceBackgroundSeed?: string;
  };
  horses?: Horse[];
};

export const HORSES: Horse[] = [
  {
    id: 4, number: 4, name: "THECOFFEEPODDOTCO", jockey: "J. LEAVY", weight: 4,
    odds: "10/1", silkPrimary: "oklch(0.82 0.13 220)", silkSecondary: "oklch(0.95 0.02 220)",
    finalPosition: 1, score: 97, isTip: true,
  },
  {
    id: 3, number: 3, name: "ADDARELLA", jockey: "T. HEARD", weight: 4,
    odds: "25/1", silkPrimary: "oklch(0.85 0.08 0)", silkSecondary: "oklch(0.92 0.04 0)",
    finalPosition: 2, score: 82,
  },
  {
    id: 1, number: 1, name: "MOE'S LEGACY", jockey: "J. WATSON", weight: 5,
    odds: "9/4", silkPrimary: "oklch(0.62 0.18 145)", silkSecondary: "oklch(0.78 0.16 90)",
    finalPosition: 3, score: 80,
  },
  {
    id: 5, number: 5, name: "SAVANNAH SMILES", jockey: "R. RYAN", weight: 6,
    odds: "40/1", silkPrimary: "oklch(0.4 0.2 265)", silkSecondary: "oklch(0.7 0.2 265)",
    finalPosition: 4, score: 64,
  },
  {
    id: 6, number: 6, name: "CORRESPONDENCE", jockey: "H. DOYLE", weight: 4,
    odds: "17/2", silkPrimary: "oklch(0.6 0.22 25)", silkSecondary: "oklch(0.3 0.04 265)",
    finalPosition: 5, score: 64,
  },
  {
    id: 2, number: 2, name: "SILVER WRAITH", jockey: "D. PROBERT", weight: 4,
    odds: "3/1", silkPrimary: "oklch(0.5 0.2 25)", silkSecondary: "oklch(0.25 0.04 265)",
    finalPosition: 6, score: 62,
  },
];

export function parseVirtualRacePayload(search: string): VirtualRacePayload | null {
  try {
    const params = new URLSearchParams(search);
    const encoded = params.get("raceData");
    if (!encoded) return null;

    try {
      const parsedDirect = JSON.parse(decodeURIComponent(encoded)) as VirtualRacePayload;
      if (parsedDirect && typeof parsedDirect === "object") return parsedDirect;
    } catch {
      // Fallback for legacy base64 payload format.
    }

    const binary = window.atob(encoded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(decoded) as VirtualRacePayload;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}