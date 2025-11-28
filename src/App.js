import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Usuário
import ModernLogin from "./components/ModernLogin";
import ModernCadastro from "./components/ModernCadastro";
import AtivarConta from "./components/Sellers";
import RentalDashboard from "./components/RentalDashboard";
import RentClothingPage from "./components/RentClothingPage";
import { ProductList, ProductDetail } from "./components/produtos";

// Admin
import ModernLoginAdmin from "./components/ModernLoginAdmin";
import AdminCadastro from "./components/AdminCadastro";
import AdminDashboard from "./components/AdminDashboard";

import "./App.css";

function App() {
  // TOKEN do usuário (não afeta admin)
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentView, setCurrentView] = useState("login");

  // TOKEN do admin como estado reativo
  const [isAdminLogged, setIsAdminLogged] = useState(
    !!localStorage.getItem("adminToken")
  );

  // funções de controle
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
        {/* ROTAS DE USUÁRIO */}
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

        {/* ROTAS DE ADMIN */}

        {/* Login do admin */}
        <Route
          path="/admin/login"
          element={
            <ModernLoginAdmin
              setAdminToken={(token) => {
                localStorage.setItem("adminToken", token);
                setIsAdminLogged(true); // atualização reativa
              }}
            />
          }
        />

        {/* Cadastro do admin */}
        <Route path="/admin/cadastro" element={<AdminCadastro />} />

        {/* Dashboard do admin */}
        <Route
          path="/admin/dashboard"
          element={
            isAdminLogged ? (
              <AdminDashboard
                onLogout={() => {
                  localStorage.removeItem("adminToken");
                  localStorage.removeItem("role");
                  localStorage.removeItem("adminEmail");
                  setIsAdminLogged(false); // logout limpo sem reload
                }}
              />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />

        {/* Rota coringa para admin */}
        <Route
          path="/admin/*"
          element={<Navigate to="/admin/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
