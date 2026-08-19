import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPuitsDisponibles, creerProduction } from "../services/productionService";
import Topbar from "../components/Topbar";

export default function ProductionPage({ user, onLogout }) {
  const [puits, setPuits] = useState([]);
  const [form, setForm] = useState({
    puits_id: "",
    date_production: "",
    volume: "",
    pression: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPuits() {
      try {
        const data = await getPuitsDisponibles();
        setPuits(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Impossible de charger les puits.");
      }
    }

    loadPuits();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        puits_id: Number(form.puits_id),
        date_production: form.date_production,
        volume: Number(form.volume),
        pression: Number(form.pression),
      };

      const result = await creerProduction(payload);
      setMessage(
        result?.alerte
          ? `Saisie enregistrée : alerte déclenchée sur ${result.alerte?.puits?.nom || "le puits concerné"}.`
          : "Saisie enregistrée avec succès."
      );
      setForm({ puits_id: "", date_production: "", volume: "", pression: "" });
    } catch (err) {
      setError(err.message || "Erreur lors de la saisie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Topbar />

      <main className="page-wrap">
        <div className="page-card" style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <Link className="secondary-btn" to="/dashboard">← Retour</Link>
              <div>
                <h1 style={{ margin: 0 }}>Saisie de production</h1>
                <p style={{ margin: "0.4rem 0 0", color: "#64748b" }}>Connecté en tant que {user?.nom || user?.mail}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="field">
              <label htmlFor="puits_id">Puits concerné</label>
              <select id="puits_id" name="puits_id" value={form.puits_id} onChange={handleChange} required>
                <option value="">Sélectionner un puits</option>
                {puits.map((p) => (
                  <option key={p.id} value={p.id}>{p.nom}</option>
                ))}
              </select>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="date_production">Date de production</label>
                <input id="date_production" type="date" name="date_production" value={form.date_production} onChange={handleChange} required />
              </div>

              <div className="field">
                <label htmlFor="volume">Volume</label>
                <input id="volume" type="number" step="0.01" name="volume" value={form.volume} onChange={handleChange} required />
              </div>
            </div>

            <div className="field">
              <label htmlFor="pression">Pression</label>
              <input id="pression" type="number" step="0.01" name="pression" value={form.pression} onChange={handleChange} required />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer la production"}
            </button>
          </form>

          {message && <p style={{ marginTop: 20, color: "green" }}>{message}</p>}
          {error && <p style={{ marginTop: 20, color: "crimson" }}>{error}</p>}
        </div>
      </main>
    </div>
  );
}
