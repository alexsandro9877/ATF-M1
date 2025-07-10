import axios from "axios";
import { Product } from "../types/product";

// GET buscar produto no parceiro cadastro
export class GetProductFromCosmosService {
  private readonly baseUrl = process.env.COSMOS_BASE_URL;
  private readonly token = process.env.COSMOS_TOKEN;

async execute(gtin: string): Promise<Product> {
    const res = await axios.get<Product>(`${this.baseUrl}/${gtin}.json`, {
        headers: {
            "User-Agent": "Cosmos-API-Request",
            "Content-Type": "application/json",
            "X-Cosmos-Token": this.token,
        },
    });
    return res.data;
}
}