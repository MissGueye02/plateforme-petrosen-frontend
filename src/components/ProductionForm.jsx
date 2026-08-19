import React, { useState } from "react";
import { creerProduction } from "../services/productionService";
import { useAuth } from "../hooks/useAuth.js";

const ETAT_INITIAL = {
  puits_id: "",
  date_production: "",
  volume: "",
  pression: "",
};

/**
 * Formulaire de saisie de production.
 * Accès réservé au rôle "ingenieur_terrain" (double contrôle : la route
 * parente est déjà protégée par RoleRoute, on revérifie ici pour éviter
 * tout affichage résiduel si le rôle change en session).
 *
 * @param {{puits: {id:number, nom:string}[]}} props - liste des puits
 * disponibles, à charger depuis une étape précédente (API /api/puits).
 */
export default function ProductionForm({ puits = [] }) {
  const { hasRole } = useAuth();
  const [form, setForm] = useState(ETAT_INITIAL);
  const [enCours, setEnCours] = useState(false);
  const [erreurs, setErreurs] = useState({});
  const [resultat, setResultat] = useState(null); // { niveau, alerte, message }
  const [erreurGlobale, setErreurGlobale] = useState(null);

  if (!hasRole("ingenieur_terrain")) {
    return (
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
        Cette saisie est réservée au rôle « ingénieur terrain ».
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreurs({});
    setErreurGlobale(null);
    setResultat(null);
    setEnCours(true);

    try {
      const data = await creerProduction({
        puits_id: Number(form.puits_id),
        date_production: form.date_production,
        volume: Number(form.volume),
        pression: Number(form.pression),
      });

      setResultat(data);

      if (data.niveau === "normal") {
        setForm(ETAT_INITIAL);
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setErreurs(err.response.data.errors ?? {});
      } else if (err.response?.status === 403) {
        setErreurGlobale("Vous n'êtes pas autorisé à effectuer cette saisie.");
      } else {
        setErreurGlobale("Une erreur est survenue lors de l'enregistrement. Réessayez.");
      }
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-slate-900 mb-4">
        Saisie d'une production
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="puits_id" className="block text-sm font-medium text-slate-700">
            Puits concerné
          </label>
          <select
            id="puits_id"
            name="puits_id"
            value={form.puits_id}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="" disabled>
              Sélectionner un puits
            </option>
            {puits.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom}
              </option>
            ))}
          </select>
          {erreurs.puits_id && (
            <p className="text-sm text-red-600 mt-1">{erreurs.puits_id[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="date_production" className="block text-sm font-medium text-slate-700">
            Date de production
          </label>
          <input
            id="date_production"
            type="date"
            name="date_production"
            value={form.date_production}
            onChange={handleChange}
            required
            max={new Date().toISOString().slice(0, 10)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
          {erreurs.date_production && (
            <p className="text-sm text-red-600 mt-1">{erreurs.date_production[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="volume" className="block text-sm font-medium text-slate-700">
              Volume (m³)
            </label>
            <input
              id="volume"
              type="number"
              step="0.01"
              min="0"
              name="volume"
              value={form.volume}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
            {erreurs.volume && (
              <p className="text-sm text-red-600 mt-1">{erreurs.volume[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="pression" className="block text-sm font-medium text-slate-700">
              Pression (bar)
            </label>
            <input
              id="pression"
              type="number"
              step="0.01"
              min="0"
              name="pression"
              value={form.pression}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
            {erreurs.pression && (
              <p className="text-sm text-red-600 mt-1">{erreurs.pression[0]}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={enCours}
          className="w-full rounded-md bg-slate-900 text-white py-2 font-medium disabled:opacity-50"
        >
          {enCours ? "Enregistrement..." : "Enregistrer la saisie"}
        </button>
      </form>

      {erreurGlobale && (
        <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {erreurGlobale}
        </div>
      )}

      {/* Confirmation après saisie réussie */}
      {resultat && resultat.niveau === "normal" && (
        <div className="mt-4 p-4 rounded-md bg-green-50 border border-green-200 text-green-800">
          ✅ Saisie enregistrée avec succès. Le niveau de production est normal.
          <a href="/dashboard" className="block mt-2 underline text-sm">
            Consulter le tableau de bord
          </a>
        </div>
      )}

      {/* Avertissement si une alerte a été déclenchée */}
      {resultat && resultat.niveau === "anormal" && (
        <div className="mt-4 p-4 rounded-md bg-red-50 border border-red-300 text-red-800">
          <p className="font-semibold">⚠️ Seuil dépassé — une alerte a été déclenchée.</p>
          <p className="text-sm mt-1">{resultat.alerte?.message}</p>
          <a href={`/alertes/${resultat.alerte?.id}`} className="block mt-2 underline text-sm">
            Voir l'alerte
          </a>
        </div>
      )}
    </div>
  );
}
