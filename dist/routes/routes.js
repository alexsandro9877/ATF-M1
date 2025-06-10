import { protectedRoutes } from './protected';
import { mercadoLivreRoutes } from './mercadoLivreRoutes';
export async function routes(app) {
    // Rota de proteção para gerar token
    // app.register(authRoutes);
    // Rotas protegidas
    app.register(protectedRoutes);
    app.register(mercadoLivreRoutes);
}
