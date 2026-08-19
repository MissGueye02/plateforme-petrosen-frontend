import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLE_CODES, normalizeRole, roleLabel } from "../utils/roles";

export default function Topbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const role = normalizeRole(user?.role);

  const linksByRole = {
    [ROLE_CODES.ADMIN]: [
      ["/dashboard", "Tableau de bord"],
      ["/utilisateurs", "Utilisateurs"],
      ["/roles", "Rôles & permissions"],
      ["/seuils", "Seuils"],
      ["/rapports", "Rapports"],
    ],
    [ROLE_CODES.PROJECT_MANAGER]: [
      ["/dashboard", "Tableau de bord"],
      ["/blocs", "Blocs / Puits"],
      ["/gisements", "Gisements"],
      ["/chef/productions", "Production"],
      ["/chef/rapports", "Rapports à vérifier"],
      ["/alertes", "Alertes"],
    ],
    [ROLE_CODES.ENGINEER]: [
      ["/dashboard", "Tableau de bord"],
      ["/production/nouvelle", "Saisie production"],
      ["/mes-missions", "Mes missions"],
      ["/ingenieur/rapports", "Rapports techniques"],
      ["/alertes", "Alertes"],
    ],
    [ROLE_CODES.PARTNER]: [
      ["/partenaire/projets", "Projets"],
      ["/partenaire/rapports", "Rapports"],
    ],
    [ROLE_CODES.AUDITOR]: [
      ["/auditeur/rapports", "Rapports ITIE"],
    ],
  };

  const links = linksByRole[role] || [];

  return (
    <header className="topbar">
      <div className="topbar-left">
        <Link to={role === ROLE_CODES.PARTNER ? "/partenaire/projets" : role === ROLE_CODES.AUDITOR ? "/auditeur/rapports" : "/dashboard"} className="topbar-brand">
          <span className="topbar-brand-mark" /> PETROSEN
        </Link>
        <nav className="topbar-nav" aria-label="Navigation principale">
          {links.map(([to, label]) => (
            <Link key={to} className={location.pathname === to ? "topbar-link active" : "topbar-link"} to={to}>
              {label}
            </Link>
          ))}
          <Link className={location.pathname === "/profil" ? "topbar-link active" : "topbar-link"} to="/profil">Profil</Link>
          <Link className={location.pathname === "/notifications" ? "topbar-link active" : "topbar-link"} to="/notifications">🔔</Link>
        </nav>
      </div>

      <div className="topbar-right">
        <div className="user-chip">
          <span className="dot" />
          <span>{user?.prenom ? `${user.prenom} ${user.nom || ""}` : user?.nom || user?.mail}</span>
          <small>{roleLabel(role)}</small>
        </div>
        <button className="ghost-btn" onClick={() => logout()}>Se déconnecter</button>
      </div>
    </header>
  );
}
