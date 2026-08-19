import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import { creerUtilisateur, getRoles, getUtilisateurs, modifierUtilisateur, supprimerUtilisateur } from "../services/usersService";
import { roleLabel } from "../utils/roles";

export default function UsersPage({ user }) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ nom: "", prenom: "", mail: "", motdepasse: "", role_id: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function refresh() {
    setLoading(true);
    try {
      const [usersData, rolesData] = await Promise.all([getUtilisateurs(), getRoles()]);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (err) {
      setError(err.message || "Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  function reset() {
    setForm({ nom: "", prenom: "", mail: "", motdepasse: "", role_id: "" });
    setEditingId(null);
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await modifierUtilisateur(editingId, { role_id: Number(form.role_id) });
        setSuccess("Le rôle a été modifié.");
      } else {
        await creerUtilisateur({ ...form, role_id: Number(form.role_id) });
        setSuccess("Utilisateur créé avec succès.");
      }
      reset();
      await refresh();
    } catch (err) {
      setError(err.message || "Opération impossible.");
    }
  }

  async function remove(id) {
    if (!window.confirm("Désactiver cet utilisateur ?")) return;
    try {
      await supprimerUtilisateur(id);
      await refresh();
      setSuccess("Utilisateur désactivé.");
    } catch (err) {
      setError(err.message || "Impossible de désactiver l'utilisateur.");
    }
  }

  return (
    <div className="app-shell">
      <Topbar />
      <main className="page-wrap">
        <div className="page-card">
          <div className="page-heading">
            <div>
              <span className="eyebrow">Administration</span>
              <h1>Gestion des utilisateurs</h1>
              <p>Vous gérez uniquement les comptes que vous avez créés.</p>
            </div>
          </div>

          <form className="form-grid admin-user-form" onSubmit={submit}>
            <div className="field-row">
              <div className="field"><label>Nom</label><input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required disabled={!!editingId} /></div>
              <div className="field"><label>Prénom</label><input value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} disabled={!!editingId} /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>Email</label><input type="email" value={form.mail} onChange={e => setForm({...form, mail: e.target.value})} required disabled={!!editingId} /></div>
              <div className="field"><label>{editingId ? "Rôle" : "Mot de passe"}</label>
                {editingId ? (
                  <select value={form.role_id} onChange={e => setForm({...form, role_id: e.target.value})} required>
                    <option value="">Choisir un rôle</option>
                    {roles.map(role => <option key={role.id} value={role.id}>{roleLabel(role.code || role.libelle)}</option>)}
                  </select>
                ) : <input type="password" value={form.motdepasse} onChange={e => setForm({...form, motdepasse: e.target.value})} minLength={8} required />}
              </div>
            </div>
            {!editingId && <div className="field"><label>Rôle</label><select value={form.role_id} onChange={e => setForm({...form, role_id: e.target.value})} required><option value="">Choisir un rôle</option>{roles.map(role => <option key={role.id} value={role.id}>{roleLabel(role.code || role.libelle)}</option>)}</select></div>}
            <div className="form-actions">
              <button type="submit">{editingId ? "Modifier le rôle" : "Créer l'utilisateur"}</button>
              {editingId && <button type="button" className="ghost-btn" onClick={reset}>Annuler</button>}
            </div>
          </form>

          {error && <div className="alert-box danger">{error}</div>}
          {success && <div className="alert-box success">{success}</div>}

          {loading ? <p>Chargement…</p> : (
            <div className="table-card table-responsive">
              <table className="table">
                <thead><tr><th>Utilisateur</th><th>Email</th><th>Rôle</th><th>Créé par</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td><strong>{u.prenom} {u.nom}</strong></td>
                      <td>{u.mail}</td>
                      <td><span className="status-pill">{roleLabel(u.role?.code || u.role?.libelle)}</span></td>
                      <td>{u.createur ? `${u.createur.prenom || ""} ${u.createur.nom || ""}` : "Compte historique"}</td>
                      <td>
                        {u.id !== user?.id && u.created_by === user?.id && (
                          <div className="action-row"><button className="secondary-btn" onClick={() => { setEditingId(u.id); setForm({ nom: u.nom || "", prenom: u.prenom || "", mail: u.mail || "", motdepasse: "", role_id: u.role_id || u.role?.id || "" }); }}>Rôle</button><button className="danger-btn" onClick={() => remove(u.id)}>Désactiver</button></div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
