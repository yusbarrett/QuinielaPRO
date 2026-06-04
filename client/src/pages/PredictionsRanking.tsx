import { useCallback } from "react";
import { api } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";
import { useAsyncData } from "../hooks/useAsyncData";

function medal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return rank;
}

export default function PredictionsRanking() {
  const { t } = useLanguage();
  const fetchRanking = useCallback(() => api.getRanking(), []);
  const { data: ranking, loading, error } = useAsyncData(fetchRanking);

  if (loading) return <div className="loading">{t("ranking.loading")}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="page-header">
        <h1>{t("ranking.title")}</h1>
        <p>{t("ranking.subtitle")}</p>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("ranking.rank")}</th>
              <th>{t("ranking.player")}</th>
              <th>{t("ranking.totalPoints")}</th>
              <th>{t("ranking.exactScores")}</th>
              <th>{t("ranking.correctResults")}</th>
              <th>{t("ranking.predictions")}</th>
            </tr>
          </thead>
          <tbody>
            {ranking?.map((entry) => (
              <tr key={entry.userId}>
                <td>
                  <span className="rank-medal">{medal(entry.rank)}</span>
                </td>
                <td>
                  <span style={{ marginRight: "0.5rem" }}>{entry.avatar}</span>
                  <strong>{entry.displayName}</strong>
                  <span
                    style={{
                      color: "var(--text-muted)",
                      marginLeft: "0.5rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    @{entry.username}
                  </span>
                </td>
                <td>
                  <strong style={{ color: "var(--pitch-mid)", fontSize: "1.1rem" }}>
                    {entry.totalPoints}
                  </strong>
                </td>
                <td>{entry.exactScores}</td>
                <td>{entry.correctResults}</td>
                <td>
                  {entry.scoredPredictions}/{entry.totalPredictions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
