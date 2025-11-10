import React, { useState, useEffect } from "react";
import {
  criarProduto,
  listarProdutos,
  buscarProdutoPorId,
  atualizarProduto,
  inativarProduto,
} from "./produtos";
import SalesForm from "./SalesForm";
import "./AdminDashboard.css";

const AdminDashboard = ({ adminToken, onLogout }) => {
  const [activeTab, setActiveTab] = useState("listar");
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [produtoForm, setProdutoForm] = useState({
    categoria: "",
    tamanho: "",
    cores: "",
    tempoValor: "",
    status: "disponivel",
    localizacao: "",
    imagem_url: "",
  });

  const categorias = [
    "Vestido",
    "Camisa",
    "Calça",
    "Saia",
    "Blazer",
    "Casaco",
    "Acessório",
  ];
  const tamanhos = ["PP", "P", "M", "G", "GG", "XG"];
  const cores = [
    "Preto",
    "Branco",
    "Azul",
    "Vermelho",
    "Verde",
    "Amarelo",
    "Rosa",
    "Roxo",
    "Cinza",
    "Marrom",
  ];
  const statusOptions = ["disponivel", "alugado", "manutencao"];

  const handleProdutoChange = (e) => {
    const { name, value } = e.target;
    setProdutoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchProdutos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listarProdutos();
      console.log("Resposta da API:", response);

      // Backend retorna array direto
      const produtosArray = Array.isArray(response) ? response : [];
      console.log("Produtos processados:", produtosArray);

      setProdutos(produtosArray);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setError("Erro ao carregar produtos: " + error.message);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleSubmitProduto = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const produtoData = {
        ...produtoForm,
        tempoValor: parseInt(produtoForm.tempoValor),
      };

      await criarProduto(produtoData);
      setSuccess("✅ Produto cadastrado com sucesso!");
      setProdutoForm({
        categoria: "",
        tamanho: "",
        cores: "",
        tempoValor: "",
        status: "disponivel",
        localizacao: "",
        imagem_url: "",
      });
      fetchProdutos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message || "Erro ao cadastrar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = async (productId) => {
    setLoading(true);
    setError("");
    try {
      const produto = await buscarProdutoPorId(productId);
      console.log("Produto buscado:", produto);
      setViewingProduct(produto);
      setShowViewModal(true);
    } catch (error) {
      setError("Erro ao carregar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (productId) => {
    setLoading(true);
    setError("");
    try {
      const produto = await buscarProdutoPorId(productId);
      console.log("Produto para editar:", produto);
      setEditingProduct(produto);
      setProdutoForm({
        categoria: produto.categoria || "",
        tamanho: produto.tamanho || "",
        cores: produto.cores || "",
        tempoValor: produto.tempoValor || "",
        status: produto.status || "disponivel",
        localizacao: produto.localizacao || "",
        imagem_url: produto.imagem_url || "",
      });
      setShowEditModal(true);
    } catch (error) {
      setError("Erro ao carregar produto para edição");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const produtoData = {
        ...produtoForm,
        tempoValor: parseInt(produtoForm.tempoValor),
      };

      await atualizarProduto(editingProduct.id_roupa, produtoData);
      setSuccess("✅ Produto atualizado com sucesso!");
      setShowEditModal(false);
      setEditingProduct(null);
      setProdutoForm({
        categoria: "",
        tamanho: "",
        cores: "",
        tempoValor: "",
        status: "disponivel",
        localizacao: "",
        imagem_url: "",
      });
      fetchProdutos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message || "Erro ao atualizar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleInactivateProduct = async (productId) => {
    if (!window.confirm("⚠️ Tem certeza que deseja inativar este produto?")) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await inativarProduto(productId);
      setSuccess("✅ Produto inativado com sucesso!");
      fetchProdutos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message || "Erro ao inativar produto");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    onLogout();
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    setProdutoForm({
      categoria: "",
      tamanho: "",
      cores: "",
      tempoValor: "",
      status: "disponivel",
      localizacao: "",
      imagem_url: "",
    });
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingProduct(null);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "disponivel":
        return "Disponível";
      case "alugado":
        return "Alugado";
      case "manutencao":
        return "Manutenção";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "disponivel":
        return "✅";
      case "alugado":
        return "📦";
      case "manutencao":
        return "🔧";
      default:
        return "❓";
    }
  };

  const filteredProdutos = produtos.filter((produto) => {
    const matchesSearch =
      !searchTerm ||
      (produto.categoria || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (produto.cores || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (produto.id_roupa || "").toString().includes(searchTerm);

    const matchesStatus =
      !filterStatus || (produto.status || "") === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getImageForCategory = (categoria, imagemUrl) => {
    // Se tem imagem_url, usa ela
    if (imagemUrl && imagemUrl.trim() !== "") {
      return imagemUrl;
    }

    // Senão, usa imagem padrão por categoria
    const imageMap = {
      Vestido:
        "https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1b5?w=300&h=400&fit=crop",
      Blazer:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
      Saia: "https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=300&h=400&fit=crop",
      Calça:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop",
      Camisa:
        "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=400&fit=crop",
      Casaco:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop",
      Acessório:
        "https://images.unsplash.com/photo-1506629905607-d405b7a82e96?w=300&h=400&fit=crop",
    };
    return (
      imageMap[categoria] ||
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=400&fit=crop"
    );
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="header-left">
            <h1>🎯 Painel Administrativo</h1>
            <p className="header-subtitle">Gerenciamento de Produtos</p>
          </div>
          <div className="admin-user-info">
            <div className="user-badge">
              <span className="user-icon">👤</span>
              <span>{localStorage.getItem("adminEmail")}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Sair
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <nav className="admin-sidebar">
          <ul className="admin-nav">
            <li>
              <button
                className={`nav-btn ${
                  activeTab === "cadastrar" ? "active" : ""
                }`}
                onClick={() => setActiveTab("cadastrar")}
              >
                <span className="nav-icon">➕</span>
                <span>Cadastrar Produto</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-btn ${activeTab === "listar" ? "active" : ""}`}
                onClick={() => setActiveTab("listar")}
              >
                <span className="nav-icon">📦</span>
                <span>Produtos Cadastrados</span>
              </button>
            </li>
          </ul>

          <div className="sidebar-stats">
            <h3>📊 Estatísticas</h3>
            <div className="stat-item">
              <span className="stat-label">Total de Produtos</span>
              <span className="stat-value">{produtos.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Disponíveis</span>
              <span className="stat-value stat-success">
                {produtos.filter((p) => p.status === "disponivel").length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Alugados</span>
              <span className="stat-value stat-warning">
                {produtos.filter((p) => p.status === "alugado").length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Manutenção</span>
              <span className="stat-value stat-danger">
                {produtos.filter((p) => p.status === "manutencao").length}
              </span>
            </div>
          </div>
        </nav>

        <main className="admin-main">
          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">❌</span>
              <span>{error}</span>
              <button className="alert-close" onClick={() => setError("")}>
                ✕
              </button>
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✅</span>
              <span>{success}</span>
              <button className="alert-close" onClick={() => setSuccess("")}>
                ✕
              </button>
            </div>
          )}

          {activeTab === "listar" && (
            <div className="product-list-section">
              <div className="section-header">
                <div>
                  <h2>📦 Produtos Cadastrados</h2>
                  <p>Gerencie todos os produtos disponíveis no sistema.</p>
                </div>
                <div className="search-filter-container">
                  <input
                    type="text"
                    placeholder="Buscar por categoria, cor ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Todos os Status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {getStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <p>Carregando produtos...</p>
              ) : filteredProdutos.length > 0 ? (
                <div className="product-grid">
                  {filteredProdutos.map((produto) => (
                    <div key={produto.id_roupa} className="product-card">
                      <img
                        src={getImageForCategory(
                          produto.categoria,
                          produto.imagem_url
                        )}
                        alt={produto.categoria}
                        className="product-image"
                      />
                      <div className="product-info">
                        <h3>{produto.categoria}</h3>
                        <p>ID: {produto.id_roupa}</p>
                        <p>Tamanho: {produto.tamanho}</p>
                        <p>Cores: {produto.cores}</p>
                        <p>Valor: R$ {produto.tempoValor}</p>
                        <p>
                          Status: {getStatusIcon(produto.status)}{" "}
                          {getStatusLabel(produto.status)}
                        </p>
                        <p>Localização: {produto.localizacao}</p>
                      </div>
                      <div className="product-actions">
                        <button
                          onClick={() => handleViewProduct(produto.id_roupa)}
                          className="action-btn view-btn"
                        >
                          Detalhes
                        </button>
                        <button
                          onClick={() => handleEditProduct(produto.id_roupa)}
                          className="action-btn edit-btn"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() =>
                            handleInactivateProduct(produto.id_roupa)
                          }
                          className="action-btn inactivate-btn"
                        >
                          Inativar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nenhum produto encontrado.</p>
              )}
            </div>
          )}

          {activeTab === "cadastrar" && (
            <div className="cadastrar-section">
              <div className="section-header">
                <div>
                  <h2>➕ Cadastrar Novo Produto</h2>
                  <p>Adicione um novo produto ao seu inventário.</p>
                </div>
              </div>
              <form onSubmit={handleSubmitProduto} className="product-form">
                <div className="form-group">
                  <label htmlFor="categoria">Categoria:</label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={produtoForm.categoria}
                    onChange={handleProdutoChange}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="tamanho">Tamanho:</label>
                  <select
                    id="tamanho"
                    name="tamanho"
                    value={produtoForm.tamanho}
                    onChange={handleProdutoChange}
                    required
                  >
                    <option value="">Selecione um tamanho</option>
                    {tamanhos.map((tam) => (
                      <option key={tam} value={tam}>
                        {tam}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="cores">Cores:</label>
                  <select
                    id="cores"
                    name="cores"
                    value={produtoForm.cores}
                    onChange={handleProdutoChange}
                    required
                  >
                    <option value="">Selecione uma cor</option>
                    {cores.map((cor) => (
                      <option key={cor} value={cor}>
                        {cor}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="tempoValor">Valor:</label>
                  <input
                    type="number"
                    id="tempoValor"
                    name="tempoValor"
                    value={produtoForm.tempoValor}
                    onChange={handleProdutoChange}
                    placeholder="Valor do produto"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    name="status"
                    value={produtoForm.status}
                    onChange={handleProdutoChange}
                    required
                  >
                    {statusOptions.map((stat) => (
                      <option key={stat} value={stat}>
                        {getStatusLabel(stat)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="localizacao">Localização:</label>
                  <input
                    type="text"
                    id="localizacao"
                    name="localizacao"
                    value={produtoForm.localizacao}
                    onChange={handleProdutoChange}
                    placeholder="Localização do produto"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="imagem_url">URL da Imagem:</label>
                  <input
                    type="text"
                    id="imagem_url"
                    name="imagem_url"
                    value={produtoForm.imagem_url}
                    onChange={handleProdutoChange}
                    placeholder="URL da imagem do produto (opcional)"
                  />
                </div>
                <button type="submit" className="submit-btn">
                  Cadastrar Produto
                </button>
              </form>
            </div>
          )}

          {activeTab === "vender" && (
            <div className="sales-section">
              <SalesForm adminToken={adminToken} />
            </div>
          )}
        </main>

        {showEditModal && editingProduct && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Editar Produto</h2>
              <form onSubmit={handleUpdateProduct} className="product-form">
                <div className="form-group">
                  <label htmlFor="edit-categoria">Categoria:</label>
                  <select
                    id="edit-categoria"
                    name="categoria"
                    value={produtoForm.categoria}
                    onChange={handleProdutoChange}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-tamanho">Tamanho:</label>
                  <select
                    id="edit-tamanho"
                    name="tamanho"
                    value={produtoForm.tamanho}
                    onChange={handleProdutoChange}
                    required
                  >
                    <option value="">Selecione um tamanho</option>
                    {tamanhos.map((tam) => (
                      <option key={tam} value={tam}>
                        {tam}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-cores">Cores:</label>
                  <select
                    id="edit-cores"
                    name="cores"
                    value={produtoForm.cores}
                    onChange={handleProdutoChange}
                    required
                  >
                    <option value="">Selecione uma cor</option>
                    {cores.map((cor) => (
                      <option key={cor} value={cor}>
                        {cor}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-tempoValor">Valor:</label>
                  <input
                    type="number"
                    id="edit-tempoValor"
                    name="tempoValor"
                    value={produtoForm.tempoValor}
                    onChange={handleProdutoChange}
                    placeholder="Valor do produto"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-status">Status:</label>
                  <select
                    id="edit-status"
                    name="status"
                    value={produtoForm.status}
                    onChange={handleProdutoChange}
                    required
                  >
                    {statusOptions.map((stat) => (
                      <option key={stat} value={stat}>
                        {getStatusLabel(stat)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-localizacao">Localização:</label>
                  <input
                    type="text"
                    id="edit-localizacao"
                    name="localizacao"
                    value={produtoForm.localizacao}
                    onChange={handleProdutoChange}
                    placeholder="Localização do produto"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-imagem_url">URL da Imagem:</label>
                  <input
                    type="text"
                    id="edit-imagem_url"
                    name="imagem_url"
                    value={produtoForm.imagem_url}
                    onChange={handleProdutoChange}
                    placeholder="URL da imagem do produto (opcional)"
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="submit-btn">
                    Salvar Alterações
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="cancel-btn"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showViewModal && viewingProduct && (
          <div className="modal-overlay">
            <div className="modal-content view-modal">
              <h2>Detalhes do Produto</h2>
              <div className="product-detail-card">
                <img
                  src={getImageForCategory(
                    viewingProduct.categoria,
                    viewingProduct.imagem_url
                  )}
                  alt={viewingProduct.categoria}
                  className="product-detail-image"
                />
                <div className="product-detail-info">
                  <h3>{viewingProduct.categoria}</h3>
                  <p>ID: {viewingProduct.id_roupa}</p>
                  <p>Tamanho: {viewingProduct.tamanho}</p>
                  <p>Cores: {viewingProduct.cores}</p>
                  <p>Valor: R$ {viewingProduct.tempoValor}</p>
                  <p>
                    Status: {getStatusIcon(viewingProduct.status)}{" "}
                    {getStatusLabel(viewingProduct.status)}
                  </p>
                  <p>Localização: {viewingProduct.localizacao}</p>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={closeViewModal}
                  className="cancel-btn"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
