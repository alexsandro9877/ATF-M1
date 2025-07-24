// backend/routes/auth.ts
import { FastifyInstance } from 'fastify';
import axios from 'axios';

export async function mercadoLivreAuthRoutes(app: FastifyInstance) {
  app.get('/auth/mercadolivre', async (req, reply) => {
    const clientId = process.env.ML_CLIENT_ID!;
    const redirectUri = process.env.ML_REDIRECT_URI!;/// ML_REDIRECT_URI - prod
    const authUrl = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    reply.redirect(authUrl);
  });

  app.get('auth/mercadolivre/callback', async (req, reply) => {
    const { code } = req.query as { code: string };

    const response = await axios.post('https://api.mercadolibre.com/oauth/token', {
      grant_type: 'authorization_code',
      client_id: process.env.ML_CLIENT_ID!,
      client_secret: process.env.ML_CLIENT_SECRET!,
      code,
      redirect_uri: process.env.ML_REDIRECT_URI!,
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token, user_id, expires_in, refresh_token } = response.data;

    // Aqui você pode salvar em banco
    console.log({ access_token, user_id, refresh_token });

    reply.send({ status: 'Conta conectada com sucesso!' });
  });
}
