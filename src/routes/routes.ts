// src/routes/routes.ts
import { FastifyInstance } from 'fastify';
import { protectedRoutes } from './protected';
import { mercadoLivreRoutes } from './mercadoLivreRoutes';
import { publica } from './publica';
import { fireStore } from './fireStore';

export async function routes(app: FastifyInstance) {
  // Rota de proteção para gerar token
  // app.register(authRoutes);
  // Rotas protegidas
  app.register(protectedRoutes);
  app.register(publica);
  app.register(mercadoLivreRoutes);  
  app.register(fireStore);  
}
