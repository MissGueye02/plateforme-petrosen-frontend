import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import { apiRequest } from "../services/AuthService";

export default function ThresholdsPage(){
 const [data,setData]=useState([]),[puits,setPuits]=useState([]),[form,setForm]=useState({puits_id:"",valeur_seuil:"",valeur_pression:""}),[error,setError]=useState(""),[success,setSuccess]=useState("");
 const refresh=async()=>{try{const [a,b]=await Promise.all([apiRequest("/seuils"),apiRequest("/seuils/options")]);setData(a);setPuits(b)}catch(e){setError(e.message)}};useEffect(()=>{refresh()},[]);
 const submit=async e=>{e.preventDefault();try{await apiRequest("/seuils",{method:"POST",body:JSON.stringify({puits_id:Number(form.puits_id),valeur_seuil:Number(form.valeur_seuil),valeur_pression:form.valeur_pression===""?null:Number(form.valeur_pression)})});setSuccess("Configuration enregistrée et appliquée au puits.");setForm({puits_id:"",valeur_seuil:"",valeur_pression:""});refresh()}catch(e){setError(e.message)}};
 return <div className="app-shell"><Topbar/><main className="page-wrap"><div className="page-card"><div className="page-heading"><div><span className="eyebrow">Administration</span><h1>Configuration des alertes</h1><p>Définissez les seuils de volume et de pression pour déclencher automatiquement une anomalie.</p></div></div>
 <form className="form-grid compact-form" onSubmit={submit}><div className="field"><label>Puits</label><select value={form.puits_id} onChange={e=>setForm({...form,puits_id:e.target.value})} required><option value="">Choisir un puits</option>{puits.map(p=><option key={p.id} value={p.id}>{p.nom} — {p.bloc_petrolier?.nom||"Bloc"}</option>)}</select></div><div className="field-row"><div className="field"><label>Seuil de volume</label><input type="number" min="0" step="0.01" value={form.valeur_seuil} onChange={e=>setForm({...form,valeur_seuil:e.target.value})} required/></div><div className="field"><label>Seuil de pression</label><input type="number" min="0" step="0.01" value={form.valeur_pression} onChange={e=>setForm({...form,valeur_pression:e.target.value})}/></div></div><button>Enregistrer la configuration</button></form>
 {error&&<div className="alert-box danger">{error}</div>}{success&&<div className="alert-box success">{success}</div>}
 <div className="table-card table-responsive"><table className="table"><thead><tr><th>Puits</th><th>Bloc</th><th>Volume</th><th>Pression</th><th>Configuré par</th></tr></thead><tbody>{data.map(s=><tr key={s.id}><td>{s.puits?.nom||s.puits_id}</td><td>{s.puits?.bloc_petrolier?.nom||"—"}</td><td>{s.valeur_seuil}</td><td>{s.valeur_pression??s.puits?.seuil_pression??"—"}</td><td>{s.configure_par?.nom||"—"}</td></tr>)}</tbody></table></div>
 </div></main></div>
}
