import { apiFetch } from "../api";

/**
 * 🔹 Cria um novo produto (rota restrita ao admin)
 * @param {Object} dados - Dados do produto a ser criado
 */
export async function criarProduto(dados) {
    try {
        const response = await apiFetch("/admin/produtos", {
            method: "POST",
            body: JSON.stringify(dados),
        });
        console.log("✅ Produto criado:", response);
        return response;
    } catch (error) {
        console.error("❌ Erro ao criar produto:", error);
        throw error;
    }
}

/**
 * 🔹 Lista todos os produtos (rota pública)
 */
export async function listarProdutos() {
    try {
        const response = await apiFetch("/produtos");
        console.log("📦 Produtos listados:", response);
        return response;
    } catch (error) {
        console.error("❌ Erro ao listar produtos:", error);
        throw error;
    }
}

/**
 * 🔹 Busca um produto específico por ID (rota pública)
 * @param {number|string} id - ID do produto
 */
export async function buscarProdutoPorId(id) {
    try {
        const response = await apiFetch(`/produtos/${id}`);
        console.log("🔍 Produto encontrado:", response);
        return response;
    } catch (error) {
        console.error(`❌ Erro ao buscar produto ID ${id}:`, error);
        throw error;
    }
}

/**
 * 🔹 Atualiza um produto (rota restrita ao admin)
 * @param {number|string} id - ID do produto
 * @param {Object} dados - Novos dados do produto
 */
export async function atualizarProduto(id, dados) {
    try {
        const response = await apiFetch(`/admin/produtos/${id}`, {
            method: "PUT",
            body: JSON.stringify(dados),
        });
        console.log("🔄 Produto atualizado:", response);
        return response;
    } catch (error) {
        console.error(`❌ Erro ao atualizar produto ID ${id}:`, error);
        throw error;
    }
}

/**
 * 🔹 Inativa um produto (rota restrita ao admin)
 * @param {number|string} id - ID do produto
 */
export async function inativarProduto(id) {
    try {
        const response = await apiFetch(`/admin/produtos/${id}/inativar`, {
            method: "PUT",
        });
        console.log("🚫 Produto inativado:", response);
        return response;
    } catch (error) {
        console.error(`❌ Erro ao inativar produto ID ${id}:`, error);
        throw error;
    }
}
