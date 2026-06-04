import { useCallback } from "react";
import { api } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";
import { useAsyncData } from "../hooks/useAsyncData";

export default function FairPlay() {
  const { t } = useLanguage();
  const fetchStandings = useCallback(() => api.getFairPlayStandings(), []);
  const { data: standings, loading, error } = useAsyncData(fetchStandings);

  if (loading) return <div className="loading">{t("fairPlay.loading")}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="page-header">
        <h1>{t("fairPlay.title")}</h1>
        <p>{t("fairPlay.subtitle")}</p>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t("common.team")}</th>
              <th>{t("common.group")}</th>
              <th>{t("fairPlay.fairPlayPts")}</th>
              <th>{t("fairPlay.yellowCards")}</th>
              <th>{t("fairPlay.redCards")}</th>
            </tr>
          </thead>
          <tbody>
            {standings?.map((team, index) => (
              <tr key={team.id}>
                <td>{index + 1}</td>
                <td>
                  <span className="match-team-flag">{team.flagEmoji}</span> {team.name}
                </td>
                <td>
                  <span className="group-badge">{team.group}</span>
                </td>
                <td>
                  <strong>{team.fairPlayPoints}</strong>
                </td>
                <td>{team.yellowCards}</td>
                <td style={{ color: team.redCards > 0 ? "var(--danger)" : undefined }}>
                  {team.redCards}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>{t("fairPlay.criteriaTitle")}</h3>
        <p style={{ marginTop: "0.5rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
          {t("fairPlay.criteriaText")}
        </p>
      </div>
    </>
  );
}
