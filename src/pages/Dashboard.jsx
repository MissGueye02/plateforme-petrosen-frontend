import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardService";
import Topbar from "../components/Topbar";

export default function Dashboard({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getDashboardData();
        setData(response);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement du tableau de bord.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="app-shell">
      <Topbar />

      <main className="page-wrap dashboard-page">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Tableau de bord</h1>
            <p>Bienvenue, {user?.nom || user?.mail || "utilisateur"}</p>
          </div>
        </div>

        {loading && <p>Chargement du tableau de bord…</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}

        {data && (
          <>
            <section className="dashboard-stats">
              <div className="stat-card">
                <span className="label">Production totale</span>
                <div className="value">{Number(data.kpis?.volume_total || 0).toFixed(2)} m³</div>
              </div>
              <div className="stat-card">
                <span className="label">Puits actifs</span>
                <div className="value">{data.kpis?.puits_actifs ?? 0}</div>
              </div>
              <div className="stat-card">
                <span className="label">Alertes actives</span>
                <div className="value">{data.kpis?.alertes_actives ?? 0}</div>
              </div>
            </section>

            <section className="panel-grid">
              <div className="panel">
                <h3>Volumes par jour</h3>
                <ul className="list-plain">
                  {(data.volume_par_jour || []).slice(0, 6).map((item, index) => (
                    <li key={index}>
                      <span>{item.date}</span>
                      <span className="pill">{Number(item.volume || 0).toFixed(2)} m³</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel">
                <h3>Dernières alertes</h3>
                <ul className="list-plain">
                  {(data.dernieres_alertes || []).slice(0, 5).map((alerte) => (
                    <li key={alerte.id}>
                      <span>{alerte.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
