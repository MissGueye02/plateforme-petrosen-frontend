import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import { accepterMission, getMissions, refuserMission } from "../services/fieldServices";

export default function MissionsPage() {
  const [data, setData] = useState({ missions: [], interventions: [] });
  const [error, setError] = useState("");
  const refresh = async () => { try { setData(await getMissions()); } catch (e) { setError(e.message); } };
  useEffect(() => { refresh(); }, []);
  const action = async (id, type) => { try { await (type === "accept" ? accepterMission(id) : refuserMission(id)); await refresh(); } catch (e) { setError(e.message); } };
  return <div className="app-shell"><Topbar /><main className="page-wrap"><div className="page-card"><div className="page-heading"><div><span className="eyebrow">Terrain</span><h1>Mes missions</h1><p>Suivez les missions qui vous sont affectées.</p></div></div>{error && <div className="alert-box danger">{error}</div>}<div className="card-list">{(data.missions || []).map(m => <article className="item-card" key={m.id}><div><strong>{m.titre}</strong><p>{m.description || "Aucune description"}</p><small>Statut : {m.statut} {m.date ? `• ${m.date}` : ""} {m.intervention_id ? `• Intervention #${m.intervention_id}` : ""}</small></div><div className="action-row">{m.statut === "proposee" && <><button onClick={() => action(m.id,"accept")}>Accepter</button><button className="danger-btn" onClick={() => action(m.id,"reject")}>Refuser</button></>}</div></article>)}</div><h2 className="section-title">Interventions</h2><div className="card-list">{(data.interventions || []).map(i => <article className="item-card" key={i.id}><div><strong>Intervention #{i.id}</strong><p>{i.alerte?.message || "Intervention liée à une alerte"}</p></div><span className="status-pill">{i.statut}</span></article>)}</div></div></main></div>;
}
