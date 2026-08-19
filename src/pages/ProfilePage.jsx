import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import { modifierMonProfil } from "../services/usersService";
import { roleLabel } from "../utils/roles";

export default function ProfilePage({ user, onProfileUpdated }) {
  const [form, setForm] = useState({ nom: "", prenom: "", mail: "", motdepasse: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({ nom: user?.nom || "", prenom: user?.prenom || "", mail: user?.mail || "", motdepasse: "" });
  }, [user]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const payload = { ...form };
      if (!payload.motdepasse) delete payload.motdepasse;
      const response = await modifierMonProfil(payload);
      onProfileUpdated?.(response.user);
      setMessage("Votre profil a été mis à jour.");
      setForm(prev => ({ ...prev, motdepasse: "" }));
    } catch (err) {
      setError(err.message || "Impossible de mettre à jour le profil.");
    }
  }

  return <div className="app-shell"><Topbar /><main className="page-wrap"><div className="page-card profile-card">
    <div className="page-heading"><div><span className="eyebrow">Compte</span><h1>Mon profil</h1><p>{roleLabel(user?.role)}</p></div></div>
    <form className="form-grid" onSubmit={submit}>
      <div className="field-row"><div className="field"><label>Nom</label><input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required /></div><div className="field"><label>Prénom</label><input value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} /></div></div>
      <div className="field"><label>Email</label><input type="email" value={form.mail} onChange={e => setForm({...form, mail: e.target.value})} required /></div>
      <div className="field"><label>Nouveau mot de passe</label><input type="password" minLength={8} value={form.motdepasse} onChange={e => setForm({...form, motdepasse: e.target.value})} placeholder="Laisser vide pour conserver l'actuel" /></div>
      <button type="submit">Enregistrer</button>
    </form>
    {error && <div className="alert-box danger">{error}</div>}
    {message && <div className="alert-box success">{message}</div>}
  </div></main></div>;
}
