import { useState, useEffect } from "react";
import { apiFetch } from "../api";

// =======================
// Funções de API
export async function criarProduto(dados) {
  try {
    const response = await apiFetch("produtos", {
      method: "POST",
      body: JSON.stringify(dados),
    });
    return response;
  } catch (error) {
    console.error("Erro ao criar produto:", error.message);
    throw error;
  }
}

export async function listarProdutos() {
  try {
    const response = await apiFetch("produtos", { method: "GET" });
    return response;
  } catch (error) {
    console.error("Erro ao listar produtos:", error.message);
    throw error;
  }
}

export async function buscarProdutoPorId(id) {
  try {
    const response = await apiFetch(`produtos/${id}`, { method: "GET" });
    return response;
  } catch (error) {
    console.error("Erro ao buscar produto:", error.message);
    throw error;
  }
}

export async function atualizarProduto(id, dados) {
  try {
    const response = await apiFetch(`produtos/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    });
    return response;
  } catch (error) {
    console.error("Erro ao atualizar produto:", error.message);
    throw error;
  }
}

export async function inativarProduto(id) {
  try {
    const response = await apiFetch(`produtos/${id}/inativar`, {
      method: "DELETE",
    });
    return response;
  } catch (error) {
    console.error("Erro ao inativar produto:", error.message);
    throw error;
  }
}

export async function uploadImagemProduto(id, file) {
  const formData = new FormData();
  formData.append("imagem", file);

  try {
    const response = await apiFetch(`admin/${id}/imagem`, {
      // <- admin
      method: "POST",
      body: formData,
    });
    return response;
  } catch (error) {
    console.error("Erro ao enviar imagem do produto:", error.message);
    throw error;
  }
}

// =======================
// Componentes React

export function ProductList() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const data = await listarProdutos();
        setProdutos(data);
      } catch (err) {
        console.error("Erro ao listar produtos:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProdutos();
  }, []);

  if (loading) return <p>Carregando produtos...</p>;

  return (
    <div>
      {produtos.map((p) => (
        <div key={p.id}>
          <h3>{p.nome}</h3>
          <p>{p.descricao}</p>
        </div>
      ))}
    </div>
  );
}

export function ProductDetail({ id }) {
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduto() {
      try {
        const data = await buscarProdutoPorId(id);
        setProduto(data);
      } catch (err) {
        console.error("Erro ao buscar produto:", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduto();
  }, [id]);

  if (loading) return <p>Carregando produto...</p>;
  if (!produto) return <p>Produto não encontrado</p>;

  return (
    <div>
      <h2>{produto.nome}</h2>
      <p>{produto.descricao}</p>
    </div>
  );
}
