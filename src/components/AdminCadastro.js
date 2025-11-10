import React, { useState } from "react";
import "./AdminAuth.css";

const AdminCadastro = ({ setAdminToken, switchToAdminLogin }) => {
  const [formData, setFormData] = useState({
    cnpj: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return false;
    }
    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (formData.cnpj.length !== 14) {
      setError("CNPJ deve ter 14 dígitos");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const adminData = {
        cnpj: formData.cnpj,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch(
        "http://localhost:8080/api/v1/admin/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adminData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSuccess(
            "Admin cadastrado com sucesso! Redirecionando para login..."
          );
          setTimeout(() => {
            switchToAdminLogin();
          }, 2000);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erro ao cadastrar admin");
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <h2>Cadastro Admin</h2>
          <p>Crie sua conta administrativa</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-auth-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="cnpj">CNPJ</label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              required
              placeholder="Digite o CNPJ (14 dígitos)"
              maxLength="14"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Nome da Empresa</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Digite o nome da empresa"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Digite seu email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Digite sua senha (mín. 6 caracteres)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirme sua senha"
            />
          </div>

          <button
            type="submit"
            className="admin-auth-button"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <div className="admin-auth-footer">
          <p>
            Já tem uma conta?
            <button
              type="button"
              className="link-button"
              onClick={switchToAdminLogin}
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminCadastro;
