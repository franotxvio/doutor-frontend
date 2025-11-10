import React, { useState, useEffect } from "react";
import { createSale, listarProdutos } from "../api";
import "./SalesForm.css";

function SalesForm({ adminToken }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await listarProdutos(adminToken);
        setProducts(Array.isArray(response) ? response : []); // garantindo array
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setMessage("Erro ao carregar produtos.");
      }
    };
    fetchProducts();
  }, [adminToken]);

  useEffect(() => {
    const product = products.find(
      (p) => p.id_roupa === parseInt(selectedProduct)
    );
    if (product) {
      setTotalPrice(product.tempoValor * quantity);
    } else {
      setTotalPrice(0);
    }
  }, [selectedProduct, quantity, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || quantity <= 0) {
      setMessage(
        "Por favor, selecione um produto e insira uma quantidade válida."
      );
      return;
    }

    try {
      const product = products.find(
        (p) => p.id_roupa === parseInt(selectedProduct)
      );
      if (!product) {
        setMessage("Produto selecionado inválido.");
        return;
      }

      const saleData = {
        id_produto: parseInt(selectedProduct),
        quantidade: quantity,
        valor_total: totalPrice,
      };

      await createSale(saleData, adminToken); // ✅ usando createSale
      setMessage("Venda criada com sucesso!");
      setSelectedProduct("");
      setQuantity(1);
      setTotalPrice(0);
    } catch (error) {
      console.error("Erro ao criar venda:", error);
      setMessage(
        "Erro ao criar venda. Verifique o console para mais detalhes."
      );
    }
  };

  return (
    <div className="sales-form-container">
      <h2>Criar Nova Venda</h2>
      <form onSubmit={handleSubmit} className="sales-form">
        <div className="form-group">
          <label htmlFor="product-select">Produto:</label>
          <select
            id="product-select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
          >
            <option value="">Selecione um produto</option>
            {products.map((product) => (
              <option key={product.id_roupa} value={product.id_roupa}>
                {product.categoria} - {product.tamanho} ({product.tempoValor}{" "}
                R$)
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="quantity-input">Quantidade:</label>
          <input
            id="quantity-input"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label>Valor Total:</label>
          <span>{totalPrice.toFixed(2)} R$</span>
        </div>
        <button type="submit" className="submit-btn">
          Registrar Venda
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default SalesForm;
