import { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api";
import "./RentalAuth.css";

export default function ModernLogin({ setToken, switchToCadastro }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setError("");
    setLoading(true);

    try {
      const data = await apiFetch("login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!data.token) {
        throw new Error("Token não retornado pelo servidor");
      }

      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email);
    } catch (err) {
      console.error("Erro no login:", err);
      setError(err.message || "Email ou senha incorretos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rental-auth-container">
      <Link to="/admin/login" className="admin-link">
        Área do Administrador
      </Link>

      <div className="rental-auth-card">
        <div className="rental-logo">
          <h1>DoutorRent</h1>
          <p className="rental-tagline">Alugue o look perfeito</p>
        </div>

        <div className="rental-auth-content">
          <h2>Entrar na sua conta</h2>
          <p>Acesse seu guarda-roupa virtual</p>

          {error && <div className="rental-error">{error}</div>}

          <form onSubmit={handleEmailSubmit} className="rental-form">
            <input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rental-input"
            />

            <input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rental-input"
            />

            <button
              type="submit"
              className="continue-btn"
              disabled={loading || !email || !password}
            >
              {loading ? "Entrando..." : "Continuar"}
            </button>
          </form>

          <div className="rental-footer">
            <a href="#" className="footer-link">
              Política de Privacidade
            </a>
            <a href="#" className="footer-link">
              Termos de Uso
            </a>
          </div>

          <div className="auth-switch-rental">
            <p>Novo no DoutorRent?</p>
            <button className="switch-button-rental" onClick={switchToCadastro}>
              Criar conta gratuita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
