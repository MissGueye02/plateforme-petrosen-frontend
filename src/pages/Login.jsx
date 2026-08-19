import { useState } from "react";
import { login } from "../services/AuthService";
import "./Login.css";

export default function Login({ onLoginSuccess }) {
    const [identifiant, setIdentifiant] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await login(identifiant, password);
            if (onLoginSuccess) onLoginSuccess(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-header">
                <div className="login-logo">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.2l7 3.5v8.6l-7 3.5-7-3.5V7.7l7-3.5z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </div>
                <h1 className="login-title">PETROSEN</h1>
                <p className="login-subtitle">Gestion des ressources en hydrocarbures</p>
            </div>

            <div className="login-card">
                <div className="login-card-heading">
                    <span className="login-icon">&#8594;]</span>
                    <h2>Connexion</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <label className="login-label" htmlFor="identifiant">
                        <span className="login-label-icon">&#128100;</span> Identifiant
                    </label>
                    <input
                        id="identifiant"
                        type="text"
                        className="login-input"
                        placeholder="Votre identifiant"
                        value={identifiant}
                        onChange={(e) => setIdentifiant(e.target.value)}
                        required
                        autoFocus
                    />

                    <label className="login-label" htmlFor="password">
                        <span className="login-label-icon">&#128274;</span> Mot de passe
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="login-input"
                        placeholder="Votre mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="login-error">{error}</p>}

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>
            </div>
        </div>
    );
}