import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  mercadoLivreCallback,
  mercadolibreResToken,
  mercadolibreResCache,
  getMercadoLivreOrdersAll,
  getCategoryAttributesController,
  postPublicProductController,
  searchProductByNameController,
  getItemDescriptionController,
  searchProductsController,
  getTrendsController,
  histTrendsController,
} from "../controllers/mercadoLivreController";

import axios from "axios";

export async function mercadoLivreRoutes(app: FastifyInstance) {
  app.get("/api/mercadolivre/callback", mercadoLivreCallback);
  app.get("/auth/mercadolivre/callback", async (req, reply) => {
    const client_id = process.env.ML_CLIENT_ID!;
    const client_secret = process.env.ML_CLIENT_SECRET!;
    const redirect_uri = process.env.ML_REDIRECT_URI!;

    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", client_id);
    params.append("client_secret", client_secret);
    params.append("redirect_uri", redirect_uri);

    try {
      const response = await axios.post(
        "https://api.mercadolibre.com/oauth/token",
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return reply.send(response.data);
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      return reply
        .status(400)
        .send({ error: error.response?.data || error.message });
    }
  });
  //// para pegar o token para poder gerar o refresh token
  app.get("/api/auth/mercadolivre/login",async function (request: FastifyRequest, reply: FastifyReply) {
      const redirect_uri = process.env.ML_REDIRECT_URI!; /// prod
      const client_id = process.env.ML_CLIENT_ID!;
      const url = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;
      reply.redirect(url);
    }
  );
  app.post("/api/mercadolivre/callback", async (request: FastifyRequest, reply: FastifyReply) => {
      console.log(request)
      // return new mercadolibreResToken().handle(request, reply);
    }
  );
  app.get("/api/mercadolivre/auth/user", async (request: FastifyRequest, reply: FastifyReply) => {
      return new mercadolibreResToken().handle(request, reply); }
  );
  app.get("/api/mercadolivre/orders", async (request: FastifyRequest, reply: FastifyReply) => {
      return new getMercadoLivreOrdersAll().handle(request, reply); }
  );
  app.get("/api/mercadolivre/categories/:categoryId/attributes", async (request: FastifyRequest, reply: FastifyReply) => {
      return new getCategoryAttributesController().handle(request, reply); }  
  );
  app.post("/api/mercadolivre/products", async (request: FastifyRequest, reply: FastifyReply) => {
      return new postPublicProductController().handle(request, reply); }   
  );
   app.get("/api/mercadolivre/ProductByName", async (request: FastifyRequest, reply: FastifyReply) => {
      return new searchProductByNameController().handle(request, reply); }   
  );
    app.get("/api/mercadolivre/items/id/:itemId", async (request: FastifyRequest, reply: FastifyReply) => {
      return new getItemDescriptionController().handle(request, reply); }   
  );
   app.get("/api/mercadolivre/search", async (request: FastifyRequest, reply: FastifyReply) => {
      return new searchProductsController().handle(request, reply); }   
  );
    app.get("/api/mercadolivre/trends", async (request: FastifyRequest, reply: FastifyReply) => {
      return new getTrendsController ().handle(request, reply); }   
  );
     app.get("/api/mercadolivre/histTrends/:data", async (request: FastifyRequest, reply: FastifyReply) => {
      return new histTrendsController ().handle(request, reply); }   
  );
  app.get("/api/mercadolivre/auth/cache", async (request: FastifyRequest, reply: FastifyReply) => {
      return new mercadolibreResCache().handle(request, reply);
    }
  );
 

  

 

}
