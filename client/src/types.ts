export interface Team {
  id: string;
  name: string;
  code: string;
  group: string;
  flagEmoji: string;
  fifaRank: number;
  fairPlayPoints: number;
  yellowCards: number;
  redCards: number;
}

export interface GameResult {
  id: string;
  matchday: number;
  date: string;
  time: string;
  stage: string;
  venue: string;
  city: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "scheduled" | "live" | "finished";
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
}

export interface Prediction {
  id: string;
  userId: string;
  gameId: string;
  homeScore: number;
  awayScore: number;
  points: number | null;
  createdAt: string;
}

export interface RankingEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  totalPredictions: number;
  scoredPredictions: number;
  totalPoints: number;
  exactScores: number;
  correctResults: number;
}

export interface Summary {
  totalTeams: number;
  totalGames: number;
  finishedGames: number;
  scheduledGames: number;
  totalUsers: number;
  totalPredictions: number;
}

export interface HeadToHead {
  teamA: Team | undefined;
  teamB: Team | undefined;
  meetings: GameResult[];
  teamAWins: number;
  teamBWins: number;
  draws: number;
}
