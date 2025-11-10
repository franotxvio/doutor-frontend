import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listPublicProducts } from "../api";
import "./ProductPublicList.css";

export default function ProductPublicList() {
    const [produtos, setProdutos] = useState([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await listPublicProducts();
                setProdutos(data);
                setFiltered(data);
            } catch (err) {
                console.error("Erro ao carregar produtos:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        const termo = search.toLowerCase();
        setFiltered(
            produtos.filter(
                (p) =>
                    p.nome.toLowerCase().includes(termo) ||
                    p.categoria?.toLowerCase().includes(termo) ||
                    p.cor?.toLowerCase().includes(termo)
            )
        );
    }, [search, produtos]);

    if (loading) return <p>Carregando produtos...</p>;

    return (
        <div className="public-product-list">
            <h1>Produtos Disponíveis</h1>
            <p>Confira os produtos ativos no momento</p>

            <input
                type="text"
                placeholder="Buscar por nome, categoria ou cor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-bar"
            />

            <div className="grid">
                {filtered.length > 0 ? (
                    filtered.map((produto) => (
                        <div key={produto.id} className="card">
                            <img
                                src={produto.imagem || "https://via.placeholder.com/200"}
                                alt={produto.nome}
                            />
                            <div className="info">
                                <h3>{produto.nome}</h3>
                                <p>{produto.categoria}</p>
                                <p className="price">R$ {produto.preco?.toFixed(2)}</p>
                                <Link to={`/produtos/${produto.id}`} className="btn">
                                    Ver Detalhes
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nenhum produto encontrado.</p>
                )}
            </div>
        </div>
    );
}
