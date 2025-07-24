import axios, { AxiosResponse, AxiosStatic } from "axios";
import { Product } from "../types/product";

// GET buscar produto no parceiro cadastro
export class GetProductFromCosmosService {
  private readonly baseUrl = process.env.COSMOS_BASE_URL;
  private readonly token = process.env.COSMOS_TOKEN;

  async execute(gtin: string): Promise<Product> {
    try {
      const res: AxiosResponse = await axios.get<AxiosStatic>(
        `${this.baseUrl}/${gtin}.json`,
        {
          headers: {
            "User-Agent": "Cosmos-API-Request",
            "Content-Type": "application/json",
            "X-Cosmos-Token": this.token,
          },
        }
      );
      
      return res.data;
    } catch (error: any) {
           return error.response?.data;
    }
  }
}
