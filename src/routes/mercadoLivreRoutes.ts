import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { mercadoLivreCallback } from "../controllers/mercadoLivreController";
import axios from "axios";

export async function mercadoLivreRoutes(app: FastifyInstance) {
  app.get("/auth/mercadolivre/callback", mercadoLivreCallback);
  
  app.get("/api/auth/mercadolivre/callback", async (req, reply) => {
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
  app.get("/api/auth/mercadolivre/login",async function (request: FastifyRequest, reply: FastifyReply) {
      const redirect_uri = process.env.ML_REDIRECT_URI!;
      const client_id = process.env.ML_CLIENT_ID!;
      const url = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;
      reply.redirect(url);
    }
  );
}
