import { NavLink, Outlet } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import type { TranslationPath } from "../i18n/LanguageContext";

const navItems: { path: string; labelKey: TranslationPath; icon: string }[] = [
  { path: "/", labelKey: "nav.home", icon: "🏠" },
  { path: "/world-cup", labelKey: "nav.worldCup", icon: "🌍" },
  { path: "/daily-schedule", labelKey: "nav.dailySchedule", icon: "📅" },
  { path: "/fair-play", labelKey: "nav.fairPlay", icon: "🤝" },
  { path: "/head-to-head", labelKey: "nav.headToHead", icon: "⚔️" },
  { path: "/predictions", labelKey: "nav.predictions", icon: "🔮" },
  { path: "/predictions-ranking", labelKey: "nav.predictionsRanking", icon: "🏅" },
  { path: "/settings", labelKey: "nav.settings", icon: "⚙️" },
];

export default function Layout() {
  const { t } = useLanguage();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">⚽</div>
          <div className="sidebar-title">{t("sidebar.title")}</div>
          <div className="sidebar-subtitle">{t("sidebar.subtitle")}</div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `sidebar-link${isActive ? " active" : ""}`
                  }
                >
                  <span className="sidebar-link-icon">{item.icon}</span>
                  {t(item.labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">{t("sidebar.footer")}</div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
