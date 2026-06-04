import { useCallback, useMemo } from "react";
import { api } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";
import { useAsyncData } from "../hooks/useAsyncData";
import type { GameResult, Team } from "../types";

export default function Predictions() {
  const { t, locale } = useLanguage();
  const fetchPredictions = useCallback(() => api.getPredictions(), []);
  const fetchGames = useCallback(() => api.getGames(), []);
  const fetchTeams = useCallback(() => api.getTeams(), []);
  const { data: predictions, loading, error } = useAsyncData(fetchPredictions);
  const { data: games } = useAsyncData(fetchGames);
  const { data: teams } = useAsyncData(fetchTeams);

  const gameMap = useMemo(() => {
    const map = new Map<string, GameResult>();
    games?.forEach((g) => map.set(g.id, g));
    return map;
  }, [games]);

  const teamMap = useMemo(() => {
    const map = new Map<string, Team>();
    teams?.forEach((team) => map.set(team.id, team));
    return map;
  }, [teams]);

  if (loading) return <div className="loading">{t("predictions.loading")}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="page-header">
        <h1>{t("predictions.title")}</h1>
        <p>{t("predictions.subtitle")}</p>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("predictions.match")}</th>
              <th>{t("predictions.prediction")}</th>
              <th>{t("predictions.actual")}</th>
              <th>{t("predictions.points")}</th>
              <th>{t("predictions.date")}</th>
            </tr>
          </thead>
          <tbody>
            {predictions?.map((pred) => {
              const game = gameMap.get(pred.gameId);
              const home = game ? teamMap.get(game.homeTeamId) : undefined;
              const away = game ? teamMap.get(game.awayTeamId) : undefined;
              return (
                <tr key={pred.id}>
                  <td>
                    {home?.flagEmoji} {home?.code ?? "?"} {t("common.vs")} {away?.flagEmoji}{" "}
                    {away?.code ?? "?"}
                  </td>
                  <td>
                    <strong>
                      {pred.homeScore} - {pred.awayScore}
                    </strong>
                  </td>
                  <td>
                    {game?.status === "finished"
                      ? `${game.homeScore} - ${game.awayScore}`
                      : "—"}
                  </td>
                  <td>
                    {pred.points !== null ? (
                      <strong
                        style={{
                          color:
                            pred.points >= 5
                              ? "var(--success)"
                              : pred.points >= 2
                                ? "var(--warning)"
                                : "var(--text-muted)",
                        }}
                      >
                        {pred.points} {t("common.pts")}
                      </strong>
                    ) : (
                      <span className="badge badge-scheduled">{t("common.pending")}</span>
                    )}
                  </td>
                  <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {new Date(pred.createdAt).toLocaleDateString(locale)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
