import exp from "constants";
import { refreshAccessToken,buscarProdutoDoML } from "../integrations/mercadoLivre";
import { TokenDataResponse } from "../lib/tokenCache";

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

export { responseToken,responseTokenCache };
