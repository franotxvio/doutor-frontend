import React, { useEffect, useState, useCallback } from "react";
import { listarVendas, inativarVenda, processComplexValue } from "./vendas";
import "./AdminSales.css";

// Componente para exibir a lista de vendas e permitir a inativação
const AdminSales = ({ onSalesUpdate }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true); // Carregamento geral da lista
  const [loadingIds, setLoadingIds] = useState([]); // Carregamento específico de cada venda
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Função para buscar vendas
  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarVendas();
      setSales(data);
      if (onSalesUpdate) onSalesUpdate(data);
    } catch (err) {
      console.error("Erro ao listar vendas:", err);
      setError("Erro ao carregar vendas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [onSalesUpdate]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // Função para inativar uma venda
  const handleInactivateSale = async (id) => {
    if (
      !window.confirm(`⚠️ Tem certeza que deseja inativar a venda ID: ${id}?`)
    )
      return;

    setLoadingIds((prev) => [...prev, id]);
    setError(null);
    setSuccessMessage(null);

    try {
      await inativarVenda(id);
      setSuccessMessage(`✅ Venda ID ${id} inativada com sucesso!`);
      await fetchSales();
    } catch (err) {
      console.error("Erro ao inativar venda:", err);
      setError(`❌ Erro ao inativar venda ID ${id}.`);
    } finally {
      setLoadingIds((prev) => prev.filter((lid) => lid !== id));
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Formatação do total
  const formatTotal = (total) => {
    const value = processComplexValue(total);
    if (value === null || value === undefined || isNaN(value)) {
      return "Não calculado"; // ou "R$ 0,00" temporariamente
    }
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  };

  // Formatação da data
  const formatDate = (dataVenda) => {
    const time = processComplexValue(dataVenda); // extrai Time
    if (!time) return "N/A";
    const date = new Date(time);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString("pt-BR");
  };

  if (loading && sales.length === 0) return <p>Carregando vendas...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-sales-container">
      <h2>Vendas Ativas ({sales.length})</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}

      {sales.length === 0 && !loading ? (
        <p>Nenhuma venda ativa encontrada.</p>
      ) : (
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto ID</th>
                <th>E-mail Cliente</th>
                <th>Data</th>
                <th>Status</th>
                <th>Total</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.ID}>
                  <td>{sale.ID}</td>
                  <td>{sale.ProdutoID}</td>
                  <td>{sale.ClienteEmail}</td>
                  <td>{formatDate(sale.DataVenda)}</td>
                  <td>{sale.Status}</td>
                  <td>{formatTotal(sale.Total)}</td>
                  <td>
                    <button
                      onClick={() => handleInactivateSale(sale.ID)}
                      disabled={loadingIds.includes(sale.ID)}
                      className="inactivate-btn"
                    >
                      {loadingIds.includes(sale.ID)
                        ? "Inativando..."
                        : "Inativar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSales;
