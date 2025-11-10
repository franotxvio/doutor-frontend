import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ModernLogin from "./components/ModernLogin";
import ModernCadastro from "./components/ModernCadastro";
import AtivarConta from "./components/Sellers";
import RentalDashboard from "./components/RentalDashboard";
import RentClothingPage from "./components/RentClothingPage";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import ModernLoginAdmin from "./components/MordernLoginAdm";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentView, setCurrentView] = useState("login");

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
  };

  const switchToLogin = () => setCurrentView("login");
  const switchToCadastro = () => setCurrentView("cadastro");

  return (
    <Router>
      <Routes>
        {/* Rotas de usuário */}
        {!token ? (
          <>
            <Route
              path="/"
              element={
                currentView === "login" ? (
                  <ModernLogin
                    setToken={setToken}
                    switchToCadastro={switchToCadastro}
                  />
                ) : (
                  <ModernCadastro
                    setToken={setToken}
                    switchToLogin={switchToLogin}
                  />
                )
              }
            />
            <Route path="/ativar-conta" element={<AtivarConta />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route
              path="/dashboard"
              element={
                <RentalDashboard token={token} onLogout={handleLogout} />
              }
            />
            <Route
              path="/alugar/:id"
              element={
                <RentClothingPage token={token} onLogout={handleLogout} />
              }
            />
            <Route path="/produtos" element={<ProductList token={token} />} />
            <Route
              path="/produtos/:id"
              element={<ProductDetail token={token} />}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}

        {/* Rotas admin */}
        <Route
          path="/admin/login"
          element={
            <ModernLoginAdmin
              setAdminToken={(token) => {
                localStorage.setItem("adminToken", token);
                window.location.href = "/admin/dashboard";
              }}
            />
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            localStorage.getItem("adminToken") ? (
              <AdminDashboard
                onLogout={() => {
                  localStorage.removeItem("adminToken");
                  window.location.href = "/admin/login";
                }}
              />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        {/* Qualquer rota admin inválida redireciona */}
        <Route
          path="/admin/*"
          element={<Navigate to="/admin/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
