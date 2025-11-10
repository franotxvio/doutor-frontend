// services/produtos.js
import {
  listarProdutos as apiListarProdutos,
  criarProduto as apiCriarProduto,
  buscarProdutoPorId as apiBuscarProdutoPorId,
  inativarProduto as apiInativarProduto,
  atualizarProduto as apiAtualizarProduto,
} from "../api";

/**
 * Retorna todos os produtos (admin ou público conforme token)
 * @param {string} adminToken - Token de autenticação
 */
export async function listarProdutos(adminToken) {
  return apiListarProdutos(adminToken);
}

/**
 * Cria um novo produto
 * @param {Object} dadosProduto - Dados do produto a ser criado
 * @param {string} adminToken - Token de autenticação
 */
export async function criarProduto(dadosProduto, adminToken) {
  return apiCriarProduto(dadosProduto, adminToken);
}

/**
 * Busca um produto específico pelo ID
 * @param {number|string} idProduto - ID do produto
 * @param {string} adminToken - Token de autenticação
 */
export async function buscarProdutoPorId(idProduto, adminToken) {
  return apiBuscarProdutoPorId(idProduto, adminToken);
}

/**
 * Atualiza os dados de um produto existente
 * @param {number|string} idProduto - ID do produto
 * @param {Object} dadosProduto - Novos dados do produto
 * @param {string} adminToken - Token de autenticação
 */
export async function atualizarProduto(idProduto, dadosProduto, adminToken) {
  return apiAtualizarProduto(idProduto, dadosProduto, adminToken);
}

/**
 * Inativa ou deleta um produto
 * @param {number|string} idProduto - ID do produto
 * @param {string} adminToken - Token de autenticação
 */
export async function inativarProduto(idProduto, adminToken) {
  return apiInativarProduto(idProduto, adminToken);
}
