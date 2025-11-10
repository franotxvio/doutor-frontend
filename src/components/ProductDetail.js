import { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import { Link } from "react-router-dom";

import {buscarProdutoPorId} from "../services/produtosApi";
import "./ProductDetail.css";

export default function ProductDetail() {
    const { id } = useParams();
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregar() {
            try {
                const data = await buscarProdutoPorId(id);
                setProduto(data);
            } catch (err) {
                setErro("Erro ao carregar detalhes do produto");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, [id]);

    if (loading) return <p>Carregando detalhes...</p>;
    if (erro) return <p>{erro}</p>;
    if (!produto) return <p>Produto não encontrado.</p>;

    return (
        <div className="product-detail">
            <h2>👕 {produto.categoria}</h2>
            <p><strong>Tamanho:</strong> {produto.tamanho}</p>
            <p><strong>Cor:</strong> {produto.cores}</p>
            <p><strong>Localização:</strong> {produto.localizacao}</p>
            <p><strong>Status:</strong> {produto.status}</p>
            <p><strong>Preço (por período):</strong> R$ {produto.tempo_valor?.toFixed(2)}</p>

            <Link to="/produtos" className="btn-voltar">⬅ Voltar</Link>
        </div>
    );
}
