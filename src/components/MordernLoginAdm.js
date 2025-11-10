import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../api";
import "./AdminAuth.css"; // seu CSS compatível

export default function ModernLoginAdmin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await apiFetch("admin/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            // salva token no localStorage
            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("userEmail", email);

            // redireciona direto para o dashboard do admin
            navigate("/admin/dashboard");

        } catch (err) {
            setError(err.message || "Erro no login");
        }
    };

    return (
        <div className="admin-auth-container">
            <Link to="/" className="admin-link">Voltar para Usuário</Link>

            <div className="admin-auth-card">
                <h2>Login Admin</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
}
