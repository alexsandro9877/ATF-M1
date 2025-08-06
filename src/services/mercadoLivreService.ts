import exp from "constants";
import {
  refreshAccessToken,
  buscarProdutoDoML,
} from "../integrations/mercadoLivre";
import { TokenDataResponse, getAccessToken } from "../lib/tokenCache";
import axios from "axios";
import {
  converterParaFormatoBRHoje,
  dataHoraAtualFormato,
} from "../utils/dataSistem";
import {
  AddFromFireStoreService,
  GetByIdFromFireStoreService,
  UpdateFromFireStoreService,
} from "./fireStoreService";
import { admin } from "../lib/firebase";
import { MercadoLivreSendItem } from "../types/MercadoLivreItem";
import { AddFromProductService } from "./productService";
class responseToken {
  async execute() {
    const token: TokenDataResponse = await refreshAccessToken();
    return token;
  }
}

class responseTokenCache {
  async execute() {
    const valor = await buscarProdutoDoML();
    return valor;
  }
}

class getMercadoLivreOrders {
  async execute() {
    try {
      const token: TokenDataResponse = await refreshAccessToken();
      const response = await axios.get(
        "https://api.mercadolibre.com/orders/search/recent",
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      );

      const pedidos = response.data.results;

      return { pedidos };
    } catch (error: any) {
      console.error(
        "Erro ao buscar pedidos:",
        error.response?.data || error.message
      );
      return { error: "Erro ao buscar pedidos no Mercado Livre" };
    }
  }
}

class getCategoryAttributes {
  async execute(categoryId: string) {
    try {
      const token: TokenDataResponse = await refreshAccessToken();
      const response = await axios.get(
        `https://api.mercadolibre.com/categories/${categoryId}/attributes`,
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Erro ao buscar pedidos:",
        error.response?.data || error.message
      );
      return { error: "Erro ao buscar pedidos no Mercado Livre" };
    }
  }
}
interface Attribute {
  id: string;
  value_id?: string;
  value_name?: string;
}

interface ProdutoML {
  title: string;
  category_id: string;
  price: number;
  currency_id: string;
  available_quantity: number;
  buying_mode: string;
  condition: string;
  listing_type_id: string;
  description: {
    plain_text: string;
  };
  attributes: Attribute[];
  pictures?: { source: string }[];
  shipping?: {
    mode: string;
    local_pick_up: boolean;
    free_shipping: boolean;
  };
}

class postPublicProduct {
  async execute(data: MercadoLivreSendItem, idFire: string) {
    const { description } = data;
    const addProdut = new AddFromProductService
    try {
      const token: TokenDataResponse = await refreshAccessToken();

      const response = await axios.post(
        "https://api.mercadolibre.com/items",
        data,
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const itemId = response.data.id;

      // 2. Enviar a descrição separadamente
      await axios.post(
        `https://api.mercadolibre.com/items/${itemId}/description`,
        {
          plain_text: description.plain_text,
        },
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      );

      
      addProdut.execute("webProductMercadoLivre", {...response.data, idFire})
      return response.data;

    } catch (error: any) {
      console.error(
        "Erro ao publicar produto:",
        error.response?.data || error.message
      );
      throw new Error("Falha ao publicar produto no Mercado Livre.");
    }
  }
}

class searchProductByName {
  async execute(query: string) {
    const token: TokenDataResponse = await refreshAccessToken();

    try {
      const response = await axios.get(
        `https://api.mercadolibre.com/sites/MLB/search`,
        {
          params: { q: query, limit: 1 },
          headers: {
            Authorization: `Bearer ${token.access_token}`,
            Accept: "application/json",
          },
        }
      );

      // Retorna só os campos úteis
      const first = response.data.results?.[0];
      if (!first) {
        return { error: "Nenhum produto encontrado" };
      }

      return {
        title: first.title,
        price: first.price,
        currency: first.currency_id,
        thumbnail: first.thumbnail,
        link: first.permalink,
      };
    } catch (error: any) {
      console.error(
        "Erro ao buscar produto:",
        error.response?.data || error.message
      );
      return { error: "Erro ao buscar produto no Mercado Livre" };
    }
  }
}

class getItemDescription {
  async execute(itemId: string) {
    const token: TokenDataResponse = await refreshAccessToken();
    try {
      const response = await axios.get(
        `https://api.mercadolibre.com/items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
            Accept: "application/json",
          },
        }
      );

      return response.data; // { plain_text: "descrição do produto ..." }
    } catch (error: any) {
      console.error(
        "Erro ao buscar descrição do item:",
        error.response?.data || error.message
      );
      return { error: "Erro ao buscar descrição do item no Mercado Livre" };
    }
  }
}

class searchProducts {
  async execute(query: string, limit = 10) {
    const token: TokenDataResponse = await refreshAccessToken();
    try {
      const response = await axios.get(
        "https://api.mercadolibre.com/sites/MLB/search",
        {
          params: { q: query, limit },
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token.access_token}`,
          },
        }
      );

      return response.data; // aqui vem o array `results` com os produtos
    } catch (error: any) {
      console.error(
        "Erro na busca de produtos:",
        error.response?.data.status || error.message
      );
      if (error.response?.data.status === 403) {
        return {
          error: "Erro ao buscar produtos no Mercado Livre",
          status: error.response?.data.status,
        };
      }
      return { error: "Erro ao buscar produtos no Mercado Livre" };
    }
  }
}

class getTrends {
  async execute() {
    const token: TokenDataResponse = await refreshAccessToken();
    try {
      const response = await axios.get(
        "https://api.mercadolibre.com/trends/MLB",
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0",
          },
        }
      );
      return response.data; // Array de tendências
    } catch (error: any) {
      return {
        error: "Erro ao buscar tendencias no Mercado Livre",
        status: error.response?.data.status,
      };
    }
  }
}

type ITreandsGroup = {};
type ITreands = {
  id: string;
  keyword: string;
  data_inclusao: string;
  data_atualizacao?: string;
  posts: number;
};

function extrairDataBase(dataCompleta: string): string {
  return dataCompleta.split(" ")[0]; // "04/08/2025 16:18" → "04/08/2025"
}

class histTrends {

  // 🔹 Lê dados do Firestore usando o próprio doc.id como ID
  async executeGetMercFire(collection: string): Promise<ITreands[]> {
    const snapshot = await admin.firestore().collection(collection).get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id, // ID real do Firebase
        keyword: data.keyword,
        posts: data.posts,
        data_inclusao: data.data_inclusao,
        data_atualizacao: data.data_atualizacao,
      } as ITreands;
    });
  }

async getGroupsTrends(data: string) {
  const existentes = await this.executeGetMercFire("webMercadoLivreTrends");

  const filtrados = existentes.filter((e) => {
    if (!e.data_inclusao) return false;
    const dataRegistro = e.data_inclusao.split(" ")[0].trim();
    return dataRegistro === data;
  });

  return filtrados;
}

  // 🔹 Agrupa e salva dados no Firestore, usando apenas IDs do Firebase
  async groupTrends(): Promise<boolean> {
    const updateFromFireStoreService = new UpdateFromFireStoreService();
    const addFromFireStoreService = new AddFromFireStoreService();

    // Trends já existentes no Firebase
    const existentes = await this.executeGetMercFire("webMercadoLivreTrends");

    // Trends novos vindos da API
    const novosTrends = await this.groupOrigemTrends();
    const hoje = converterParaFormatoBRHoje();

    for (const novoTrend of novosTrends) {
      const indiceExistente = existentes.findIndex((trend) => {
        return trend.keyword === novoTrend.keyword;
      });

      if (indiceExistente === -1) {
        // 🔹 Não existe → incluir no Firebase
        const novoRegistro = {
          ...novoTrend,
          data_inclusao: dataHoraAtualFormato(),
        };

        const newId = await addFromFireStoreService.execute(
          "webMercadoLivreTrends",
          novoRegistro
        );

        // existentes.push({
        //   id: newId,
        //   ...novoRegistro,
        // });
      } else {
        const existente = existentes[indiceExistente];
        const atualizado = {
          ...existente,
          ...novoTrend,
          posts: existente.posts + 1,
          data_atualizacao: dataHoraAtualFormato(),
        };

        await updateFromFireStoreService.execute(
          "webMercadoLivreTrends",
          existente.id, // 🔹 ID original do Firebase
          atualizado
        );

        existentes[indiceExistente] = atualizado;
      }
    }
    return true
    // return await this.executeGetMercFire("webMercadoLivreTrends");
  }


  async groupOrigemTrends(): Promise<ITreands[]> {
    const requestTrends: ITreands[] = await new getTrends().execute();
    //@ts-check
    //@ts-expect-error
    return requestTrends.map((e) => ({
      keyword: e.keyword,
      posts: 1,
    }));
  }

}
export {
  histTrends,
  searchProducts,
  getItemDescription,
  responseToken,
  responseTokenCache,
  getMercadoLivreOrders,
  getCategoryAttributes,
  postPublicProduct,
  searchProductByName,
  getTrends,
};

// "shipping": {
//   "mode": "me2",
//   "local_pick_up": false,
//   "free_shipping": true
// }
// Campo	Obrigatório	O que faz?
// mode	 sim	Define o tipo de entrega. Use "me2" (Mercado Envios 2) na maioria dos casos.
// local_pick_up	opcional	Se o comprador pode retirar o produto em mãos. Normalmente false.
// free_shipping	 sim	Se o frete será gratuito para o comprador. Isso afeta o valor cobrado e a comissão.
