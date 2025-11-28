// Define a URL base dependendo do ambiente
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
console.log("API URL:", BASE_URL);

/**
 * Função genérica de fetch para a API
 */
export async function apiFetch(endpoint, options = {}, authToken = null) {
  const token = authToken || localStorage.getItem("token");
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(!isFormData && { "Content-Type": "application/json" }),
    ...options.headers,
  };

  let response, data;

  try {
    response = await fetch(`${BASE_URL}/api/v1/${endpoint}`, {
      ...options,
      headers,
    });

    const text = await response.text();
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text };
    }
  } catch (error) {
    console.error("❌ Erro de conexão com o servidor:", error);
    throw new Error("❌ Erro de conexão com o servidor.");
  }

  if (!response.ok) {
    console.error("⚠️ Erro do backend:", data);
    const errorMessage = data.error || data.message || "Erro na API";
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Usuário
 */
export async function login(dadosLogin) {
  return apiFetch("login", {
    method: "POST",
    body: JSON.stringify(dadosLogin),
  });
}

export async function cadastro(dadosCadastro) {
  return apiFetch("cadastros", {
    method: "POST",
    body: JSON.stringify(dadosCadastro),
  });
}

/**
 * Produtos
 */
export async function listarProdutos(token) {
  return apiFetch("produtos", { method: "GET" }, token);
}

export async function buscarProdutoPorId(id, token) {
  return apiFetch(`produtos/${id}`, { method: "GET" }, token);
}

export async function criarProduto(dadosProduto, token) {
  return apiFetch(
    "produtos",
    { method: "POST", body: JSON.stringify(dadosProduto) },
    token
  );
}

export async function atualizarProduto(id, dadosProduto, token) {
  return apiFetch(
    `produtos/${id}`,
    { method: "PUT", body: JSON.stringify(dadosProduto) },
    token
  );
}

export async function inativarProduto(id, token) {
  return apiFetch(`produtos/${id}`, { method: "DELETE" }, token);
}

/**
 * Vendas / Aluguéis
 */
export async function createSale(saleData, token) {
  return apiFetch(
    "sales",
    { method: "POST", body: JSON.stringify(saleData) },
    token
  );
}

/**
 * Admin
 */
export async function loginAdmin(credentials) {
  return apiFetch("admin/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function createAdmin(adminData) {
  return apiFetch("admin/create", {
    method: "POST",
    body: JSON.stringify(adminData),
  });
}

export async function listAllProducts(adminToken) {
  return apiFetch("admin/produtos", { method: "GET" }, adminToken);
}
