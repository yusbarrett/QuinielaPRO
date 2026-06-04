import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import teamsRouter from "./routes/teams.js";
import gamesRouter from "./routes/games.js";
import predictionsRouter from "./routes/predictions.js";
import { loadDatabase } from "./db.js";

const app = express();
const PORT = process.env.PORT ?? 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../../client/dist");

app.use(cors());
app.use(express.json());
app.use(express.static(clientDistPath));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", tournament: "FIFA World Cup 2026" });
});

app.get("/api/summary", (_req, res) => {
  const db = loadDatabase();
  res.json({
    totalTeams: db.teams.length,
    totalGames: db.games.length,
    finishedGames: db.games.filter((g) => g.status === "finished").length,
    scheduledGames: db.games.filter((g) => g.status === "scheduled").length,
    totalUsers: db.users.length,
    totalPredictions: db.predictions.length,
  });
});

app.use("/api/teams", teamsRouter);
app.use("/api/games", gamesRouter);
app.use("/api/predictions", predictionsRouter);

app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`⚽ Quiniela FIFA 2026 API running on http://localhost:${PORT}`);
});
