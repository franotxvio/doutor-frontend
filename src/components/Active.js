import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "./Active.css";

export default function Active() {
  const location = useLocation();
  const navigate = useNavigate();
  const cadastroId = location.state?.cadastroId;

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code) return;

    setMessage("");
    setLoading(true);

    try {
      const response = await apiFetch("activation/verify", {
        method: "POST",
        body: JSON.stringify({
          cadastro_id: cadastroId,
          code,
        }),
      });

      if (response?.status === "success" || response?.verified) {
        setMessage("✅ Código verificado com sucesso! Redirecionando...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        throw new Error("Código inválido ou expirado.");
      }
    } catch (err) {
      console.error("Erro ao verificar código:", err);
      setMessage(`❌ ${err.message || "Falha na verificação"}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="active-container">
      <div className="active-card">
        <h2>Ativação de Conta</h2>
        <p>Digite o código enviado por SMS para o seu celular.</p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código de ativação"
          className="active-input"
          maxLength={6}
        />

        <button
          onClick={handleVerify}
          className="active-button"
          disabled={loading || !code}
        >
          {loading ? "Verificando..." : "Verificar Código"}
        </button>

        {message && <div className="active-message">{message}</div>}
      </div>
    </div>
  );
}
