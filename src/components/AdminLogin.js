import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminAuth.css";

const AdminLogin = ({ setToken, setRole }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Credenciais inválidas");
      }

      const token = `admin_${Date.now()}`;
      localStorage.setItem("token", token);
      localStorage.setItem("role", "admin");
      localStorage.setItem("userEmail", formData.email);
      setToken(token);
      setRole("admin");

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Erro ao logar admin:", err);
      setError(err.message || "Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-container">
      {/* Voltar para login de usuário */}
      <Link to="/" className="admin-link">
        Voltar para Usuário
      </Link>

      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <h2>Login Admin</h2>
          <p>Acesse o painel administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Digite seu email"
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            className="admin-auth-button"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="admin-auth-footer">
          <p>
            Não tem uma conta?{" "}
            <Link to="/admin/cadastro" className="link-button">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
