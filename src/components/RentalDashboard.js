import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createSale, apiFetch } from "../api";
import "./RentalDashboard.css";

export default function RentalDashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState("catalog");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [isLoading, setIsLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);

  const userEmail = useMemo(
    () => localStorage.getItem("userEmail") || "Usuário",
    []
  );
  const navigate = useNavigate();

  // Função para corrigir URLs de imagem
  const normalizeImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/300x400";
    if (url.startsWith("https://")) return url;
    if (url.startsWith("http://localhost:8080")) {
      return url.replace(
        "http://localhost:8080",
        "https://doutor-backend.onrender.com"
      );
    }
    if (!url.startsWith("http")) {
      return `${process.env.REACT_APP_API_URL}/uploads/${url}`;
    }
    return url;
  };

  // Carrega produtos do backend
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const data = await apiFetch("produtos", { method: "GET" }, token);

        const mappedProducts = (data || []).map((p) => {
          const finalImageUrl = normalizeImageUrl(p.image_url || p.imagem_url);
          return {
            id: p.id_roupa ?? 0,
            id_roupa: p.id_roupa ?? 0,
            name: p.categoria ?? "Produto sem nome",
            categoria: p.categoria ?? "Produto sem nome",
            tamanho: p.tamanho ?? "-",
            cores: p.cores ?? "-",
            tempoValor: p.tempo_valor ?? p.tempoValor ?? 0,
            tempo_valor: p.tempo_valor ?? p.tempoValor ?? 0,
            status: p.status ?? "disponivel",
            localizacao: p.localizacao ?? "-",
            image_url: finalImageUrl,
            imagem_url: finalImageUrl,
          };
        });

        const availableProducts = mappedProducts.filter(
          (p) => p.status === "disponivel"
        );
        setProducts(availableProducts);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        showToast("❌ Falha ao carregar produtos", "error");
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  // Carrega carrinho do localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (err) {
      console.error("Erro ao carregar carrinho:", err);
    }
  }, []);

  // Salva carrinho no localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Erro ao salvar carrinho:", err);
    }
  }, [cart]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  const addToCart = (product) => {
    if (cart.find((p) => p.id === product.id)) {
      showToast("⚠️ Já está no carrinho!", "warning");
      return;
    }
    setCart([...cart, product]);
    showToast(`✨ ${product.name} adicionado ao carrinho!`);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((p) => p.id !== id));
    showToast("❌ Item removido do carrinho.");
  };

  const goToRentPage = (productId) => navigate(`/alugar/${productId}`);
  const goToAdmin = () => navigate("/admin");

  const confirmRental = async () => {
    if (!cart.length) {
      showToast("⚠️ Carrinho vazio!", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const results = [];

      for (const item of cart) {
        const saleData = {
          produtoId: item.id,
          quantidade: 1,
          tempoValor: item.tempoValor,
        };
        const res = await createSale(saleData, token);

        results.push({
          ...item,
          backendId: res?.produtoId || null,
          total: res?.total || item.tempoValor,
          timestamp: new Date().toISOString(),
        });
      }

      setRentals((prev) => [...prev, ...results]);
      setCart([]);
      localStorage.removeItem("cart");
      setActiveTab("rentals");
      showToast(`🎉 ${results.length} item(ns) alugado(s) com sucesso!`);
    } catch (err) {
      console.error("Erro ao confirmar aluguel:", err);
      showToast(`❌ ${err.message || "Falha ao processar aluguel!"}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCartTotal = () =>
    cart.reduce((sum, item) => sum + (item.tempoValor || 0), 0);

  return (
    <div className="rental-dashboard">
      <header>
        <h1>DoutorRent</h1>
        <span>Bem-vindo, {userEmail}</span>
        <button onClick={goToAdmin}>Área do Administrador</button>
        <button onClick={onLogout}>Sair</button>
      </header>

      <nav>
        <button
          onClick={() => setActiveTab("catalog")}
          className={activeTab === "catalog" ? "active" : ""}
        >
          👗 Catálogo
        </button>
        <button
          onClick={() => setActiveTab("cart")}
          className={activeTab === "cart" ? "active" : ""}
        >
          🛒 Carrinho ({cart.length})
        </button>
        <button
          onClick={() => setActiveTab("rentals")}
          className={activeTab === "rentals" ? "active" : ""}
        >
          📦 Meus Aluguéis ({rentals.length})
        </button>
      </nav>

      <main>
        {activeTab === "catalog" && (
          <div className="catalog-section">
            {productsLoading ? (
              <div className="loading-state">⏳ Carregando produtos...</div>
            ) : products.length === 0 ? (
              <div className="empty-state">📭 Nenhum produto disponível</div>
            ) : (
              <div className="products-grid">
                {products.map((p) => (
                  <div key={p.id} className="product-card">
                    <img src={p.image_url} alt={p.name} />
                    <h3>{p.name}</h3>
                    <p>Tamanho: {p.tamanho}</p>
                    <p>Cores: {p.cores}</p>
                    <p className="price">R$ {p.tempoValor.toFixed(2)}</p>
                    <div className="product-actions">
                      <button
                        onClick={() => addToCart(p)}
                        disabled={cart.find((item) => item.id === p.id)}
                      >
                        {cart.find((item) => item.id === p.id)
                          ? "✓ No Carrinho"
                          : "Adicionar ao Carrinho"}
                      </button>
                      <button
                        onClick={() => goToRentPage(p.id)}
                        className="btn-secondary"
                      >
                        Alugar Agora
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "cart" && (
          <div className="cart-section">
            {cart.length === 0 ? (
              <div className="empty-state">
                🛒 Seu carrinho está vazio
                <button onClick={() => setActiveTab("catalog")}>
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((p) => (
                    <div key={p.id} className="cart-item">
                      <img src={p.image_url} alt={p.name} />
                      <div className="cart-item-details">
                        <h4>{p.name}</h4>
                        <p>
                          Tamanho: {p.tamanho} | Cores: {p.cores}
                        </p>
                      </div>
                      <div className="cart-item-price">
                        R$ {p.tempoValor.toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeFromCart(p.id)}
                        className="btn-remove"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="cart-total">
                    <span>Total:</span>
                    <span>R$ {calculateCartTotal().toFixed(2)}</span>
                  </div>
                  <button
                    onClick={confirmRental}
                    disabled={isLoading}
                    className="btn-confirm"
                  >
                    {isLoading ? "⏳ Processando..." : "Confirmar Aluguel"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "rentals" && (
          <div className="rentals-section">
            {rentals.length === 0 ? (
              <div className="empty-state">
                📦 Você ainda não tem aluguéis
                <button onClick={() => setActiveTab("catalog")}>
                  Ver Catálogo
                </button>
              </div>
            ) : (
              <div className="rentals-list">
                {rentals.map((r, i) => (
                  <div key={r.backendId || i} className="rental-item">
                    <h4>{r.name}</h4>
                    <span>#{r.backendId || "Pendente"}</span>
                    <p>
                      Tamanho: {r.tamanho} | Cores: {r.cores}
                    </p>
                    {r.timestamp && (
                      <p>{new Date(r.timestamp).toLocaleDateString("pt-BR")}</p>
                    )}
                    <p>Total: R$ {r.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {toast.message && (
        <div className={`toast-message ${toast.type}`}>{toast.message}</div>
      )}

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">⏳ Processando...</div>
        </div>
      )}
    </div>
  );
}
