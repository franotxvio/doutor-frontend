import { useState, useEffect, useMemo, useRef } from "react";
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
  const [rentedHighlight, setRentedHighlight] = useState(null);

  const userEmail = useMemo(
    () => localStorage.getItem("userEmail") || "Usuário",
    []
  );
  const catalogRef = useRef(null);

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

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const data = await apiFetch("produtos", { method: "GET" }, token);
        const mappedProducts = (data || []).map((p) => {
          const finalImageUrl = normalizeImageUrl(p.image_url || p.imagem_url);
          return {
            id: p.id_roupa ?? 0,
            name: p.categoria ?? "Produto sem nome",
            tamanho: p.tamanho ?? "-",
            cores: p.cores ?? "-",
            tempoValor: p.tempo_valor ?? p.tempoValor ?? 0,
            status: p.status ?? "disponivel",
            image_url: finalImageUrl,
          };
        });
        setProducts(mappedProducts);
      } catch {
        showToast("❌ Falha ao carregar produtos", "error");
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  const confirmRental = async (items = cart) => {
    if (!items.length) {
      showToast("⚠️ Nenhum item para alugar!", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const results = [];
      const updatedProducts = [...products];

      for (const item of items) {
        const productCheck = await apiFetch(
          `produtos/${item.id}`,
          { method: "GET" },
          token
        );

        if (productCheck.status !== "disponivel") {
          showToast(`⚠️ ${item.name} não está mais disponível.`, "warning");
          continue;
        }

        const saleData = {
          produtoId: item.id,
          quantidade: 1,
          tempoValor: item.tempoValor,
        };

        const res = await createSale(saleData, token);
        const newRental = {
          ...item,
          backendId: res?.produtoId || null,
          total: res?.total || item.tempoValor,
          timestamp: new Date().toISOString(),
        };
        results.push(newRental);
        const idx = updatedProducts.findIndex((p) => p.id === item.id);
        if (idx !== -1) updatedProducts[idx].status = "alugado";
        setRentedHighlight(newRental.id);
        setTimeout(() => setRentedHighlight(null), 2000);
      }

      if (!results.length) {
        showToast("⚠️ Nenhum item pôde ser alugado.", "warning");
        return;
      }

      setProducts(updatedProducts);
      setRentals((prev) => [...prev, ...results]);
      setCart((prev) => prev.filter((p) => !items.some((i) => i.id === p.id)));
      setActiveTab("rentals");
      showToast(`🎉 ${results.length} item(ns) alugado(s) com sucesso!`);
    } catch {
      showToast("❌ Falha ao processar aluguel!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const rentNow = async (product) => {
    if (product.status !== "disponivel") {
      showToast("🚫 Este item já está alugado!", "warning");
      return;
    }
    await confirmRental([product]);
  };

  const addToCart = (product) => {
    if (cart.find((p) => p.id === product.id)) {
      showToast("⚠️ Já está no carrinho!", "warning");
      return;
    }
    if (product.status !== "disponivel") {
      showToast("🚫 Produto já alugado!", "warning");
      return;
    }
    setCart([...cart, product]);
    showToast(`✨ ${product.name} adicionado ao carrinho!`);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((p) => p.id !== id));
    showToast("❌ Item removido do carrinho.");
  };

  const calculateCartTotal = () =>
    cart.reduce((sum, item) => sum + (item.tempoValor || 0), 0);

  return (
    <div className="rental-dashboard">
      <header>
        <h1>DoutorRent</h1>
        <span>Bem-vindo, {userEmail}</span>
        <div>
          <button onClick={onLogout}>Sair</button>
        </div>
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
          <div className="catalog-section" ref={catalogRef}>
            {productsLoading ? (
              <div className="loading-state">⏳ Carregando produtos...</div>
            ) : products.length === 0 ? (
              <div className="empty-state">📭 Nenhum produto disponível</div>
            ) : (
              products.map((p) => (
                <div
                  key={p.id}
                  className={`product-card ${
                    rentedHighlight === p.id ? "rented-highlight" : ""
                  }`}
                >
                  <img src={p.image_url} alt={p.name} />
                  {p.status !== "disponivel" && (
                    <span className="status-badge rented">🔒 Alugado</span>
                  )}
                  <h3>{p.name}</h3>
                  <p>Tamanho: {p.tamanho}</p>
                  <p>Cores: {p.cores}</p>
                  <p className="price">R$ {p.tempoValor.toFixed(2)}</p>
                  <div className="product-actions">
                    <button
                      onClick={() => addToCart(p)}
                      disabled={
                        p.status !== "disponivel" ||
                        cart.find((item) => item.id === p.id)
                      }
                    >
                      {p.status !== "disponivel"
                        ? "Indisponível"
                        : cart.find((item) => item.id === p.id)
                        ? "✓ No Carrinho"
                        : "Adicionar ao Carrinho"}
                    </button>
                    <button
                      onClick={() => rentNow(p)}
                      className="btn-secondary"
                      disabled={p.status !== "disponivel"}
                    >
                      {p.status !== "disponivel" ? "Alugado" : "Alugar Agora"}
                    </button>
                  </div>
                </div>
              ))
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
                    onClick={() => confirmRental(cart)}
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
                    <div className="rental-item-header">
                      <h4>{r.name}</h4>
                      <span className="rental-status">#Pendente</span>
                    </div>
                    <p className="rental-info">
                      Tamanho: <b>{r.tamanho}</b> | Cores: <b>{r.cores}</b>
                    </p>
                    <p className="rental-date">
                      {new Date(r.timestamp).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="rental-total">
                      Total: <span>R$ {r.total.toFixed(2)}</span>
                    </p>
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
    </div>
  );
}
