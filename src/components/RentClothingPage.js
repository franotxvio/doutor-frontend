import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api";

const RentClothingPage = ({ token }) => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await apiFetch(`produtos/${id}`, { method: "GET" }, token);

                if (!data) {
                    setError("Produto não encontrado.");
                    setLoading(false);
                    return;
                }

                // Mapear produto usando image_url do backend
                const mappedProduct = {
                    id: data.id_roupa ?? 0,
                    name: data.categoria ?? "Produto sem nome",
                    tempoValor: data.tempo_valor ?? 0,
                    tamanho: data.tamanho ?? "-",
                    cores: data.cores ?? "-",
                    image_url: data.image_url || "https://via.placeholder.com/300x400",
                };

                setProduct(mappedProduct);
            } catch (err) {
                console.error("Erro ao buscar produto:", err);
                setError("❌ Falha ao carregar produto.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, token]);

    if (loading) return <p>Carregando produto...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="rent-clothing-page">
            <h1>Detalhes do Produto</h1>
            <img
                src={product.image_url}
                alt={product.name}
                style={{ width: 300, height: 400, objectFit: "cover" }}
            />
            <p>Categoria: {product.name}</p>
            <p>Tamanho: {product.tamanho}</p>
            <p>Cores: {product.cores}</p>
            <p>Valor: R$ {product.tempoValor}</p>
        </div>
    );
};

export default RentClothingPage;
