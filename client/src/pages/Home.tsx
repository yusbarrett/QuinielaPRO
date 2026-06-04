import { useCallback } from "react";
import { api } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";
import { useGameLabels } from "../i18n/useGameLabels";
import { useAsyncData } from "../hooks/useAsyncData";

export default function Home() {
  const { t } = useLanguage();
  const { stageLabel } = useGameLabels();
  const fetchSummary = useCallback(() => api.getSummary(), []);
  const fetchGames = useCallback(() => api.getGames(), []);
  const { data: summary, loading, error } = useAsyncData(fetchSummary);
  const { data: games } = useAsyncData(fetchGames);

  if (loading) return <div className="loading">{t("home.loading")}</div>;
  if (error) return <div className="error">{t("common.serverError")}</div>;

  const recentGames = games?.filter((g) => g.status === "finished").slice(-3) ?? [];
  const upcomingGames = games?.filter((g) => g.status === "scheduled").slice(0, 3) ?? [];
  const displayGames = recentGames.length > 0 ? recentGames : upcomingGames;
  const sectionTitle =
    recentGames.length > 0 ? t("home.recentResults") : t("home.openingMatches");

  return (
    <>
      <div className="page-header">
        <h1>{t("home.title")}</h1>
        <p>{t("home.subtitle")}</p>
      </div>

      <div className="card-grid" style={{ marginBottom: "2rem" }}>
        <div className="stat-card">
          <div className="stat-card-value">{summary?.totalTeams}</div>
          <div className="stat-card-label">{t("home.teams")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{summary?.totalGames}</div>
          <div className="stat-card-label">{t("home.matches")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{summary?.totalUsers}</div>
          <div className="stat-card-label">{t("home.players")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{summary?.totalPredictions}</div>
          <div className="stat-card-label">{t("home.predictions")}</div>
        </div>
      </div>

      <div className="card">
        <h2>{sectionTitle}</h2>
        {displayGames.length === 0 ? (
          <p>{t("common.noMatches")}</p>
        ) : (
          displayGames.map((game) => (
            <div key={game.id} style={{ borderBottom: "1px solid #eee", padding: "1rem 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span className={`badge badge-${game.status}`}>{stageLabel(game.stage)}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  {game.date} · {game.time} {t("common.et")}
                </span>
              </div>
              <div className="match-teams">
                <span className="match-team">
                  <span>{game.homeTeamId.replace("team-", "").toUpperCase()}</span>
                </span>
                <span className="match-score">
                  {game.status === "finished"
                    ? `${game.homeScore} - ${game.awayScore}`
                    : t("common.vs")}
                </span>
                <span className="match-team">
                  <span>{game.awayTeamId.replace("team-", "").toUpperCase()}</span>
                </span>
              </div>
              <div style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {game.venue} · {game.city}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="card">
        <h2>{t("home.howScoringWorks")}</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("home.predictionCol")}</th>
              <th>{t("home.pointsCol")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t("home.exactScore")}</td>
              <td>
                <strong>5 {t("common.pts")}</strong>
              </td>
            </tr>
            <tr>
              <td>{t("home.correctResult")}</td>
              <td>
                <strong>2 {t("common.pts")}</strong>
              </td>
            </tr>
            <tr>
              <td>{t("home.goalDiffBonus")}</td>
              <td>
                <strong>+1 {t("common.pt")}</strong> {t("home.bonus")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
