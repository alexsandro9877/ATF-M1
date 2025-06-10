// src/services/produtoService.ts
import axios from 'axios';
import { getAccessToken } from '../lib/tokenCache.ts';

export async function buscarProdutoDoML(id: string) {
  const token = getAccessToken();
  if (!token) throw new Error('Token não disponível!');

  const res = await axios.get(`https://api.mercadolibre.com/items/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}
