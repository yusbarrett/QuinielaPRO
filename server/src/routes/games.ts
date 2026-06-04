import { Router } from "express";
import { loadDatabase } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  const db = loadDatabase();
  let games = db.games;

  const { date, matchday, status } = req.query;
  if (date) {
    games = games.filter((g) => g.date === date);
  }
  if (matchday) {
    games = games.filter((g) => g.matchday === Number(matchday));
  }
  if (status) {
    games = games.filter((g) => g.status === status);
  }

  res.json(games);
});

router.get("/:id", (req, res) => {
  const db = loadDatabase();
  const game = db.games.find((g) => g.id === req.params.id);
  if (!game) {
    res.status(404).json({ error: "Game not found" });
    return;
  }
  res.json(game);
});

router.get("/head-to-head/:teamA/:teamB", (req, res) => {
  const db = loadDatabase();
  const { teamA, teamB } = req.params;

  const meetings = db.games.filter(
    (g) =>
      (g.homeTeamId === teamA && g.awayTeamId === teamB) ||
      (g.homeTeamId === teamB && g.awayTeamId === teamA)
  );

  const getTeam = (id: string) => db.teams.find((t) => t.id === id);

  res.json({
    teamA: getTeam(teamA),
    teamB: getTeam(teamB),
    meetings,
    teamAWins: meetings.filter(
      (g) =>
        g.status === "finished" &&
        ((g.homeTeamId === teamA && (g.homeScore ?? 0) > (g.awayScore ?? 0)) ||
          (g.awayTeamId === teamA && (g.awayScore ?? 0) > (g.homeScore ?? 0)))
    ).length,
    teamBWins: meetings.filter(
      (g) =>
        g.status === "finished" &&
        ((g.homeTeamId === teamB && (g.homeScore ?? 0) > (g.awayScore ?? 0)) ||
          (g.awayTeamId === teamB && (g.awayScore ?? 0) > (g.homeScore ?? 0)))
    ).length,
    draws: meetings.filter(
      (g) =>
        g.status === "finished" && g.homeScore !== null && g.homeScore === g.awayScore
    ).length,
  });
});

export default router;
