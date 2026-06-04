import { useCallback, useState } from "react";
import { api } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";
import { useAsyncData } from "../hooks/useAsyncData";
import type { HeadToHead } from "../types";

export default function HeadToHeadComp() {
  const { t } = useLanguage();
  const fetchTeams = useCallback(() => api.getTeams(), []);
  const { data: teams, loading, error } = useAsyncData(fetchTeams);

  const [teamA, setTeamA] = useState("team-usa");
  const [teamB, setTeamB] = useState("team-par");
  const [h2h, setH2h] = useState<HeadToHead | null>(null);
  const [h2hLoading, setH2hLoading] = useState(false);

  const compare = async () => {
    if (teamA === teamB) return;
    setH2hLoading(true);
    try {
      const result = await api.getHeadToHead(teamA, teamB);
      setH2h(result);
    } catch {
      setH2h(null);
    } finally {
      setH2hLoading(false);
    }
  };

  if (loading) return <div className="loading">{t("headToHead.loading")}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="page-header">
        <h1>{t("headToHead.title")}</h1>
        <p>{t("headToHead.subtitle")}</p>
      </div>

      <div className="card">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr auto",
            gap: "1rem",
            alignItems: "end",
          }}
        >
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="team-a">{t("headToHead.teamA")}</label>
            <select
              id="team-a"
              className="form-select"
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
            >
              {teams?.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.flagEmoji} {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="team-b">{t("headToHead.teamB")}</label>
            <select
              id="team-b"
              className="form-select"
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
            >
              {teams?.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.flagEmoji} {team.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={compare}
            disabled={teamA === teamB || h2hLoading}
          >
            {h2hLoading ? "..." : t("common.compare")}
          </button>
        </div>
      </div>

      {teamA === teamB && <div className="error">{t("common.selectTwoTeams")}</div>}

      {h2h && h2h.teamA && h2h.teamB && (
        <>
          <div className="card-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="stat-card">
              <div className="stat-card-value">{h2h.teamAWins}</div>
              <div className="stat-card-label">
                {h2h.teamA.name} {t("common.wins")}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value">{h2h.draws}</div>
              <div className="stat-card-label">{t("common.draws")}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value">{h2h.teamBWins}</div>
              <div className="stat-card-label">
                {h2h.teamB.name} {t("common.wins")}
              </div>
            </div>
          </div>

          <div className="card">
            <h2>{t("headToHead.meetingHistory")}</h2>
            {h2h.meetings.length === 0 ? (
              <p>{t("headToHead.noMeetings")}</p>
            ) : (
              h2h.meetings.map((game) => {
                const home = game.homeTeamId === h2h.teamA!.id ? h2h.teamA : h2h.teamB;
                const away = game.homeTeamId === h2h.teamA!.id ? h2h.teamB : h2h.teamA;
                return (
                  <div key={game.id} style={{ padding: "1rem 0", borderBottom: "1px solid #eee" }}>
                    <div className="match-teams">
                      <span className="match-team">
                        <span className="match-team-flag">{home?.flagEmoji}</span>
                        {home?.code}
                      </span>
                      <span className="match-score">
                        {game.status === "finished"
                          ? `${game.homeScore} - ${game.awayScore}`
                          : t("common.tbd")}
                      </span>
                      <span className="match-team">
                        <span className="match-team-flag">{away?.flagEmoji}</span>
                        {away?.code}
                      </span>
                    </div>
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {game.date} · {game.venue}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </>
  );
}
