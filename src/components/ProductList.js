import { useEffect, useState } from "react";
import { listarProdutos } from "../services/produtosApi";
import { Link } from "react-router-dom";


export default function ProductList() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregar() {
            try {
                const data = await listarProdutos();
                setProdutos(data || []);
            } catch (err) {
                setErro("Erro ao carregar produtos");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, []);

    if (loading) return <p>Carregando produtos...</p>;
    if (erro) return <p>{erro}</p>;

    return (
        <div className="product-list">
            <h2>🛍️ Produtos Disponíveis</h2>
            <div className="product-grid">
                {produtos.length === 0 ? (
                    <p>Nenhum produto encontrado.</p>
                ) : (
                    produtos.map((p) => (
                        <div key={p.id_roupa} className="product-card">
                            <h3>{p.categoria}</h3>
                            <p>Tamanho: {p.tamanho}</p>
                            <p>Cor: {p.cores}</p>
                            <p>Valor (por período): R$ {p.tempo_valor?.toFixed(2)}</p>
                            <Link to={`/produtos/${p.id_roupa}`} className="btn">
                                Ver Detalhes
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
