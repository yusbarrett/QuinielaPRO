import type {
  GameResult,
  HeadToHead,
  Prediction,
  RankingEntry,
  Summary,
  Team,
} from "../types";

const BASE = "/api";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  getSummary: () => fetchJson<Summary>("/summary"),
  getTeams: () => fetchJson<Team[]>("/teams"),
  getFairPlayStandings: () => fetchJson<Team[]>("/teams/fair-play/standings"),
  getGames: (params?: { date?: string; matchday?: number }) => {
    const query = new URLSearchParams();
    if (params?.date) query.set("date", params.date);
    if (params?.matchday) query.set("matchday", String(params.matchday));
    const qs = query.toString();
    return fetchJson<GameResult[]>(`/games${qs ? `?${qs}` : ""}`);
  },
  getPredictions: () => fetchJson<Prediction[]>("/predictions"),
  getRanking: () => fetchJson<RankingEntry[]>("/predictions/ranking"),
  getHeadToHead: (teamA: string, teamB: string) =>
    fetchJson<HeadToHead>(`/games/head-to-head/${teamA}/${teamB}`),
};
