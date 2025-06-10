import { refreshAccessToken, buscarProdutoDoML } from "../integrations/mercadoLivre";
class responseToken {
    async execute() {
        const token = await refreshAccessToken();
        return token;
    }
}
class responseTokenCache {
    async execute() {
        const valor = await buscarProdutoDoML();
        return valor;
    }
}
export { responseToken, responseTokenCache };
