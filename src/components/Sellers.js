import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "./RentalAuth.css";

export default function AtivarConta() {
  const location = useLocation();
  const email = location.state?.email;
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!codigo) {
      setError("Informe o código de ativação recebido por SMS");
      return;
    }

    setLoading(true);
    try {
      await apiFetch("ativar-conta", {
        method: "POST",
        body: JSON.stringify({ email, codigo }),
      });

      setSuccess("Conta ativada com sucesso! Redirecionando para login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      if (err.status === 401) {
        setError(
          "Código inválido ou não autorizado. Verifique o SMS ou solicite outro."
        );
      } else {
        setError(err.message || "Erro ao ativar conta");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="rental-auth-container">
        <div className="rental-auth-card">
          <p>Email não informado. Volte ao cadastro.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rental-auth-container">
      <div className="rental-auth-card">
        <div className="rental-logo">
          <h1>DoutorRent</h1>
          <p className="rental-tagline">Ative sua conta para continuar</p>
        </div>

        <div className="rental-auth-content">
          <h2>Ativação da conta</h2>
          <p>Digite o código que você recebeu por SMS</p>
          {error && <div className="rental-error">{error}</div>}
          {success && <div className="rental-success">{success}</div>}

          <form onSubmit={handleSubmit} className="rental-form">
            <input
              type="text"
              name="codigo"
              placeholder="Código de ativação"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
              className="rental-input"
            />
            <button type="submit" className="continue-btn" disabled={loading}>
              {loading ? "Validando código..." : "Ativar conta"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
