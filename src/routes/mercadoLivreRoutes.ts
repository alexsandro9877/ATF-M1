
import { FastifyInstance } from "fastify";
import { mercadoLivreCallback } from "../controllers/mercadoLivreController";

export async function mercadoLivreRoutes(app: FastifyInstance) {
  app.get("/auth/mercadolivre/callback", mercadoLivreCallback);
}
