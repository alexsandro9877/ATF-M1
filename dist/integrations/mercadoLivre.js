import 'dotenv/config';
import qs from 'qs';
import axios from 'axios';
import { getAccessToken } from '../lib/tokenCache';
const URL = process.env.ML_URL_API;
const endPoint = '/oauth/token';
const data = qs.stringify({
    grant_type: 'refresh_token',
    client_id: process.env.ML_CLIENT_ID,
    client_secret: process.env.ML_CLIENT_SECRET,
    refresh_token: process.env.ML_CODE_REF,
});
export async function refreshAccessToken() {
    try {
        const response = await axios.post(`${URL}${endPoint}`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Erro ao obter o token:', error.response?.data || error.message);
        throw new Error('Falha ao renovar o token.');
    }
}
export async function buscarProdutoDoML() {
    const token = getAccessToken();
    return token;
}
// Se quiser testar diretamente o script
// Remova se for usar apenas como módulo
if (import.meta.url === `file://${process.argv[1]}`) {
    buscarProdutoDoML().then(console.log).catch(console.error);
}
