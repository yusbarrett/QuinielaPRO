import { useCallback, useMemo, useState } from "react";
import { api } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";
import { useGameLabels } from "../i18n/useGameLabels";
import { useAsyncData } from "../hooks/useAsyncData";
import type { Team } from "../types";

export default function DailySchedule() {
  const { t, locale } = useLanguage();
  const { statusLabel, stageLabel } = useGameLabels();
  const fetchGames = useCallback(() => api.getGames(), []);
  const fetchTeams = useCallback(() => api.getTeams(), []);
  const { data: games, loading, error } = useAsyncData(fetchGames);
  const { data: teams } = useAsyncData(fetchTeams);

  const formatDate = (dateStr: string) =>
    new Date(dateStr + "T12:00:00").toLocaleDateString(locale, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const dates = useMemo(() => {
    if (!games) return [];
    return [...new Set(games.map((g) => g.date))].sort();
  }, [games]);

  const [selectedDate, setSelectedDate] = useState<string>("");

  const activeDate = selectedDate || dates[0] || "";
  const dayGames = games?.filter((g) => g.date === activeDate) ?? [];

  const teamMap = useMemo(() => {
    const map = new Map<string, Team>();
    teams?.forEach((team) => map.set(team.id, team));
    return map;
  }, [teams]);

  if (loading) return <div className="loading">{t("dailySchedule.loading")}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="page-header">
        <h1>{t("dailySchedule.title")}</h1>
        <p>{t("dailySchedule.subtitle")}</p>
      </div>

      <div className="card">
        <div className="form-group">
          <label htmlFor="date-select">{t("dailySchedule.selectDate")}</label>
          <select
            id="date-select"
            className="form-select"
            value={activeDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            {dates.map((date) => (
              <option key={date} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {dayGames.length === 0 ? (
        <div className="card">
          <p>{t("dailySchedule.noMatchesDate")}</p>
        </div>
      ) : (
        dayGames.map((game) => {
          const home = teamMap.get(game.homeTeamId);
          const away = teamMap.get(game.awayTeamId);
          return (
            <div key={game.id} className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <span className={`badge badge-${game.status}`}>{statusLabel(game.status)}</span>
                <span style={{ fontWeight: 600 }}>
                  {game.time} {t("common.et")}
                </span>
              </div>
              <div className="match-teams">
                <span className="match-team">
                  <span className="match-team-flag">{home?.flagEmoji}</span>
                  {home?.name ?? game.homeTeamId}
                </span>
                <span className="match-score">
                  {game.status === "scheduled"
                    ? t("common.vs")
                    : `${game.homeScore} - ${game.awayScore}`}
                </span>
                <span className="match-team">
                  <span className="match-team-flag">{away?.flagEmoji}</span>
                  {away?.name ?? game.awayTeamId}
                </span>
              </div>
              <div
                style={{
                  textAlign: "center",
                  marginTop: "0.75rem",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                }}
              >
                {stageLabel(game.stage)} · {t("common.matchday")} {game.matchday}
                <br />
                {game.venue}, {game.city}
              </div>
            </div>
          );
        })
      )}
    </>
  );
}
