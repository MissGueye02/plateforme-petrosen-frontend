import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import { apiRequest } from "../services/AuthService";

export default function RolesPage(){
  const [roles,setRoles]=useState([]),[permissions,setPermissions]=useState([]),[error,setError]=useState(""),[success,setSuccess]=useState("");
  const [form,setForm]=useState({libelle:"",code:""}),[permForm,setPermForm]=useState({name:"",label:""}),[selected,setSelected]=useState(null);
  const refresh=async()=>{try{const [r,p]=await Promise.all([apiRequest("/roles/detail"),apiRequest("/permissions")]);setRoles(r);setPermissions(p);setSelected(current=>current?((r||[]).find(x=>x.id===current.id)||current):null)}catch(e){setError(e.message)}};
  useEffect(()=>{refresh()},[]);
  const createRole=async e=>{e.preventDefault();try{await apiRequest("/roles",{method:"POST",body:JSON.stringify(form)});setForm({libelle:"",code:""});setSuccess("Rôle créé.");refresh()}catch(e){setError(e.message)}};
  const createPermission=async e=>{e.preventDefault();try{await apiRequest("/permissions",{method:"POST",body:JSON.stringify(permForm)});setPermForm({name:"",label:""});setSuccess("Permission créée.");refresh()}catch(e){setError(e.message)}};
  const toggle=async(pid,checked)=>{if(!selected)return;try{await apiRequest(`/roles/${selected.id}/permissions`,{method:checked?"POST":"DELETE",body:JSON.stringify({permissions:[pid]})});setSuccess("Permissions mises à jour.");refresh()}catch(e){setError(e.message)}};
  return <div className="app-shell"><Topbar/><main className="page-wrap"><div className="page-grid-2">
    <section className="page-card"><div className="page-heading"><div><span className="eyebrow">Administration</span><h1>Rôles & permissions</h1><p>Créez les rôles et configurez leurs accès.</p></div></div>
      <form className="form-grid compact-form" onSubmit={createRole}><div className="field"><label>Nom du rôle</label><input value={form.libelle} onChange={e=>setForm({...form,libelle:e.target.value})} placeholder="Chef de projet" required/></div><div className="field"><label>Code technique</label><input value={form.code} onChange={e=>setForm({...form,code:e.target.value})} placeholder="chef_projet" required/></div><button>Créer le rôle</button></form>
      <div className="card-list">{roles.map(r=><article key={r.id} className={selected?.id===r.id?"item-card selected":"item-card"} onClick={()=>setSelected(r)}><div><strong>{r.libelle}</strong><p>Code : {r.code}</p></div><span className="status-pill">{(r.permissions||[]).length} permissions</span></article>)}</div>
    </section>
    <section className="page-card"><h2>{selected?`Permissions : ${selected.libelle}`:"Sélectionnez un rôle"}</h2>{selected&&<div className="permission-grid">{permissions.map(p=><label key={p.id} className="permission-option"><input type="checkbox" checked={(selected.permissions||[]).some(x=>x.id===p.id)} onChange={e=>toggle(p.id,e.target.checked)}/><span><strong>{p.label||p.name}</strong><small>{p.name}</small></span></label>)}</div>}
      <hr/><h3>Ajouter une permission</h3><form className="form-grid compact-form" onSubmit={createPermission}><div className="field"><label>Nom technique</label><input value={permForm.name} onChange={e=>setPermForm({...permForm,name:e.target.value})} placeholder="view_reports" required/></div><div className="field"><label>Libellé</label><input value={permForm.label} onChange={e=>setPermForm({...permForm,label:e.target.value})} placeholder="Consulter les rapports"/></div><button>Créer la permission</button></form>
    </section>
  </div>{error&&<div className="alert-box danger">{error}</div>}{success&&<div className="alert-box success">{success}</div>}</main></div>
}
