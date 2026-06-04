import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import type { Language } from "../i18n/translations";

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const [username, setUsername] = useState("soccerfan42");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("world-cup");
  const [saved, setSaved] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <div className="page-header">
        <h1>{t("settings.title")}</h1>
        <p>{t("settings.subtitle")}</p>
      </div>

      <div className="card">
        <h2>{t("settings.profile")}</h2>
        <div className="form-group">
          <label htmlFor="username">{t("settings.displayUsername")}</label>
          <input
            id="username"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <h2>{t("settings.preferences")}</h2>
        <div className="form-group">
          <label htmlFor="language">{t("settings.language")}</label>
          <select
            id="language"
            className="form-select"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
          >
            <option value="en">{t("settings.languageEn")}</option>
            <option value="es">{t("settings.languageEs")}</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="theme">{t("settings.theme")}</label>
          <select id="theme" className="form-select" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="world-cup">{t("settings.themeWorldCup")}</option>
            <option value="night-match">{t("settings.themeNight")}</option>
            <option value="stadium">{t("settings.themeStadium")}</option>
          </select>
        </div>
        <div className="form-group">
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
            {t("settings.notifications")}
          </label>
        </div>
      </div>

      <div className="card">
        <h2>{t("settings.scoringRules")}</h2>
        <ul style={{ paddingLeft: "1.25rem", lineHeight: 2, color: "var(--text-muted)" }}>
          <li>
            {t("settings.exactScoreRule")} <strong>{t("settings.points5")}</strong>
          </li>
          <li>
            {t("settings.correctResultRule")} <strong>{t("settings.points2")}</strong>
          </li>
          <li>
            {t("settings.goalDiffRule")} <strong>{t("settings.point1")}</strong>
          </li>
        </ul>
      </div>

      <button className="btn btn-primary" onClick={handleSave}>
        {saved ? t("settings.saved") : t("settings.save")}
      </button>
    </>
  );
}
