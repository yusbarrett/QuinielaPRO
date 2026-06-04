import { Router } from "express";
import { loadDatabase } from "../db.js";
import type { Team } from "../types.js";

const router = Router();

router.get("/", (_req, res) => {
  const db = loadDatabase();
  res.json(db.teams);
});

router.get("/:id", (req, res) => {
  const db = loadDatabase();
  const team = db.teams.find((t) => t.id === req.params.id);
  if (!team) {
    res.status(404).json({ error: "Team not found" });
    return;
  }
  res.json(team);
});

router.get("/group/:group", (req, res) => {
  const db = loadDatabase();
  const teams = db.teams.filter(
    (t) => t.group.toUpperCase() === req.params.group.toUpperCase()
  );
  res.json(teams);
});

router.get("/fair-play/standings", (_req, res) => {
  const db = loadDatabase();
  const standings = [...db.teams].sort(
    (a: Team, b: Team) => b.fairPlayPoints - a.fairPlayPoints
  );
  res.json(standings);
});

export default router;
