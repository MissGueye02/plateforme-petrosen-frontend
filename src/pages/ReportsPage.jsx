import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { creerRapport, getRapports } from "../services/reportsService";
import Topbar from "../components/Topbar";

export default function ReportsPage({ user, onLogout }) {
  const [rapports, setRapports] = useState([]);
  const [form, setForm] = useState({ titre: "", periode_debut: "", periode_fin: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const refresh = async () => {
    try {
      const data = await getRapports();
      setRapports(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Erreur de chargement des rapports.");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await creerRapport(form);
      setSuccess("Rapport généré avec succès.");
      setForm({ titre: "", periode_debut: "", periode_fin: "" });
      await refresh();
    } catch (err) {
      setError(err.message || "Impossible de générer le rapport.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Topbar />

      <main className="page-wrap">
        <div className="page-card" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <Link className="secondary-btn" to="/dashboard">← Retour</Link>
              <div>
                <h1 style={{ margin: 0 }}>Rapports ITIE</h1>
                <p style={{ margin: "0.4rem 0 0", color: "#64748b" }}>Utilisateur : {user?.nom || user?.mail}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-grid" style={{ background: "#f8fafc", padding: 20, borderRadius: 12 }}>
            <div className="field">
              <label htmlFor="titre">Titre</label>
              <input id="titre" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} required />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="periode_debut">Période début</label>
                <input id="periode_debut" type="date" value={form.periode_debut} onChange={(e) => setForm({ ...form, periode_debut: e.target.value })} required />
              </div>

              <div className="field">
                <label htmlFor="periode_fin">Période fin</label>
                <input id="periode_fin" type="date" value={form.periode_fin} onChange={(e) => setForm({ ...form, periode_fin: e.target.value })} required />
              </div>
            </div>

            <button type="submit" disabled={loading}>{loading ? "Génération..." : "Générer le rapport"}</button>
          </form>

          {error && <p style={{ color: "crimson", marginTop: 14 }}>{error}</p>}
          {success && <p style={{ color: "green", marginTop: 14 }}>{success}</p>}

          <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
            {rapports.length === 0 ? <p>Aucun rapport généré.</p> : rapports.map((rapport) => (
              <div key={rapport.id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, background: "#fff" }}>
                <strong>{rapport.titre}</strong>
                <div>{rapport.periode_debut} → {rapport.periode_fin}</div>
                <div style={{ color: "#475569" }}>Statut : {rapport.statut || "généré"}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
