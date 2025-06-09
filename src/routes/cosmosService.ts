
import axios from "axios";

const COSMOS_API_URL = "https://api.cosmos.bluesoft.com.br/gtins";
const COSMOS_API_TOKEN = process.env.COSMOS_TOKEN;

export const buscarProdutoPorGtin = async (gtin: string) => {
  try {
    const response = await axios.get(`${COSMOS_API_URL}/${gtin}.json`, {
      headers: {
        "User-Agent": "Cosmos-API-Request",
        "Content-Type": "application/json",
        "X-Cosmos-Token": COSMOS_API_TOKEN,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produto na Cosmos:", error);
    throw new Error("Não foi possível buscar o produto");
  }
};
