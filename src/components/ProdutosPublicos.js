import React, { useEffect, useState } from "react";
import { listarProdutosPublicos, buscarProdutoPublicoPorId } from "../api";

export default function PublicProducts() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

    // Buscar todos os produtos públicos
    const fetchProdutos = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await listarProdutosPublicos();
            setProdutos(Array.isArray(data) ? data : []);
        } catch (err) {
            setError("Erro ao carregar produtos: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Buscar produto específico
    const handleVerDetalhes = async (id) => {
        setLoading(true);
        setError("");
        try {
            const produto = await buscarProdutoPublicoPorId(id);
            setProdutoSelecionado(produto);
        } catch (err) {
            setError("Erro ao carregar detalhes do produto: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, []);

    return (
        <div className="public-products">
            <h1>Produtos Disponíveis</h1>

            {loading && <p>Carregando produtos...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="product-list">
                {produtos.map((produto) => (
                    <div key={produto.id_roupa} className="product-card">
                        <h3>{produto.categoria}</h3>
                        <p>ID: {produto.id_roupa}</p>
                        <p>Tamanho: {produto.tamanho}</p>
                        <p>Cores: {produto.cores}</p>
                        <button onClick={() => handleVerDetalhes(produto.id_roupa)}>
                            Ver Detalhes
                        </button>
                    </div>
                ))}
            </div>

            {produtoSelecionado && (
                <div className="product-modal">
                    <h2>Detalhes do Produto</h2>
                    <p>ID: {produtoSelecionado.id_roupa}</p>
                    <p>Categoria: {produtoSelecionado.categoria}</p>
                    <p>Tamanho: {produtoSelecionado.tamanho}</p>
                    <p>Cores: {produtoSelecionado.cores}</p>
                    <p>Valor: R$ {produtoSelecionado.tempoValor}</p>
                    <p>Status: {produtoSelecionado.status}</p>
                    <p>Localização: {produtoSelecionado.localizacao}</p>
                    <button onClick={() => setProdutoSelecionado(null)}>Fechar</button>
                </div>
            )}
        </div>
    );
}
