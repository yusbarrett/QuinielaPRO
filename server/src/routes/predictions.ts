import { Router } from "express";
import { loadDatabase } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  const db = loadDatabase();
  let predictions = db.predictions;

  const { userId, gameId } = req.query;
  if (userId) {
    predictions = predictions.filter((p) => p.userId === userId);
  }
  if (gameId) {
    predictions = predictions.filter((p) => p.gameId === gameId);
  }

  res.json(predictions);
});

router.get("/ranking", (_req, res) => {
  const db = loadDatabase();

  const ranking = db.users
    .map((user) => {
      const userPredictions = db.predictions.filter((p) => p.userId === user.id);
      const scored = userPredictions.filter((p) => p.points !== null);
      const totalPoints = scored.reduce((sum, p) => sum + (p.points ?? 0), 0);
      const exactScores = scored.filter((p) => p.points === 5).length;
      const correctResults = scored.filter((p) => (p.points ?? 0) >= 2).length;

      return {
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        totalPredictions: userPredictions.length,
        scoredPredictions: scored.length,
        totalPoints,
        exactScores,
        correctResults,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints || b.exactScores - a.exactScores);

  ranking.forEach((entry, index) => {
    (entry as typeof entry & { rank: number }).rank = index + 1;
  });

  res.json(ranking);
});

export default router;
