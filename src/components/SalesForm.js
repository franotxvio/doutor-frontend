import React, { useState, useEffect } from "react";
import { criarVenda } from "./vendas"; // Importa a função de criação de venda
import { listarProdutos } from "./produtos"; // Presume que esta função existe para buscar produtos
import "./SalesForm.css";

function SalesForm({ adminToken, onSaleCreated }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [total, setTotal] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Efeito para buscar a lista de produtos ao carregar o componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Presume que listarProdutos retorna um array de produtos
        const response = await listarProdutos();
        setProducts(response);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setMessage("Erro ao carregar produtos.");
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!selectedProduct || !clienteEmail || !total) {
      setMessage("Por favor, preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      const saleData = {
        ProdutoID: parseInt(selectedProduct),
        ClienteEmail: clienteEmail,
        // O campo Total será enviado como string e tratado como objeto complexo no mock de vendas.js
        Total: total, 
      };

      await criarVenda(saleData);
      setMessage("✅ Venda registrada com sucesso!");
      
      // Limpar formulário
      setSelectedProduct("");
      setClienteEmail("");
      setTotal("");
      
      // Notificar o componente pai (AdminDashboard) para atualizar a lista de vendas
      if (onSaleCreated) {
        onSaleCreated();
      }

    } catch (error) {
      console.error("Erro ao criar venda:", error);
      setMessage(
        `❌ Erro ao registrar venda: ${error.message || "Erro desconhecido"}`
      );
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000); // Limpa a mensagem após 5 segundos
    }
  };

  return (
    <div className="sales-form-container">
      <h2>Registrar Nova Venda</h2>
      <form onSubmit={handleSubmit} className="sales-form">
        <div className="form-group">
          <label htmlFor="product-select">Produto:</label>
          <select
            id="product-select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Selecione um produto</option>
            {products.map((product) => (
              // Garantir que cada item renderizado no map() tenha um key único
              <option key={product.id_roupa || product.ID} value={product.id_roupa || product.ID}>
                {product.categoria} - {product.tamanho} ({product.tempoValor} R$)
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="email-input">E-mail do Cliente:</label>
          <input
            id="email-input"
            type="email"
            value={clienteEmail}
            onChange={(e) => setClienteEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="total-input">Valor Total (R$):</label>
          <input
            id="total-input"
            type="number"
            step="0.01"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Venda"}
        </button>
      </form>
      {message && <p className={`message ${message.startsWith("❌") ? "error" : "success"}`}>{message}</p>}
    </div>
  );
}

export default SalesForm;
