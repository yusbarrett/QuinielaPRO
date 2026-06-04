import { useCallback, useMemo } from "react";
import { api } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";
import { useAsyncData } from "../hooks/useAsyncData";

export default function WorldCup() {
  const { t } = useLanguage();
  const fetchTeams = useCallback(() => api.getTeams(), []);
  const { data: teams, loading, error } = useAsyncData(fetchTeams);

  const groups = useMemo(() => {
    if (!teams) return [];
    const map = new Map<string, typeof teams>();
    teams.forEach((team) => {
      const list = map.get(team.group) ?? [];
      list.push(team);
      map.set(team.group, list);
    });
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [teams]);

  if (loading) return <div className="loading">{t("worldCup.loading")}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div className="page-header">
        <h1>{t("worldCup.title")}</h1>
        <p>{t("worldCup.subtitle")}</p>
      </div>

      <div className="card-grid">
        {groups.map(([group, groupTeams]) => (
          <div key={group} className="card">
            <h3>
              <span className="group-badge">{group}</span> {t("worldCup.groupLabel")} {group}
            </h3>
            <table className="data-table" style={{ marginTop: "1rem" }}>
              <thead>
                <tr>
                  <th>{t("common.team")}</th>
                  <th>{t("common.code")}</th>
                  <th>{t("worldCup.fifaRank")}</th>
                </tr>
              </thead>
              <tbody>
                {groupTeams
                  .sort((a, b) => a.fifaRank - b.fifaRank)
                  .map((team) => (
                    <tr key={team.id}>
                      <td>
                        <span className="match-team-flag">{team.flagEmoji}</span> {team.name}
                      </td>
                      <td>{team.code}</td>
                      <td>#{team.fifaRank}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </>
  );
}
