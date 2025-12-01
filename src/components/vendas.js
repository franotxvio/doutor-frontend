import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1";

// Tratamento de valores complexos do backend
export const processComplexValue = (complexObject) => {
  if (!complexObject || typeof complexObject !== "object") return complexObject;

  if ("Float64" in complexObject && complexObject.Valid)
    return complexObject.Float64;
  if ("Bool" in complexObject && complexObject.Valid) return complexObject.Bool;
  if ("Time" in complexObject && complexObject.Valid) return complexObject.Time;

  return null;
};

// Lista vendas ativas
export const listarVendas = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/sales`);
    const vendas = Array.isArray(response.data)
      ? response.data
      : [response.data];

    // Filtra apenas vendas ativas com base em Ativa.Bool
    return vendas.filter((venda) => processComplexValue(venda.Ativa));
  } catch (error) {
    console.error("Erro ao listar vendas da API:", error);
    throw error;
  }
};

// Inativa venda
export const inativarVenda = async (vendaId) => {
  try {
    const response = await axios.put(`${BASE_URL}/sales/${vendaId}/inactivate`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao inativar venda ID ${vendaId}:`, error);
    throw error;
  }
};

// Cria nova venda
export const criarVenda = async (novaVendaData) => {
  try {
    const response = await axios.post(`${BASE_URL}/sales`, novaVendaData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar venda:", error);
    throw error;
  }
};
