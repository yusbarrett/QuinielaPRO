import { readFileSync } from "fs";
import { join } from "path";
import type { Database } from "./types.js";

const DB_PATH = join(process.cwd(), "data", "database.json");

export function loadDatabase(): Database {
  const raw = readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as Database;
}

export function reloadDatabase(): Database {
  return loadDatabase();
}
