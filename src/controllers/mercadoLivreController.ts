
import axios from "axios";

export const mercadoLivreCallback = async (req, reply) => {
  const { code } = req.query;

  try {
    const response = await axios.post("https://api.mercadolibre.com/oauth/token", {
      grant_type: "authorization_code",
      client_id: 2668378137203164,
      client_secret: 'Lw83l8ka6WlWytrkqo3PQYNXjImzc6cG',
      code,
      redirect_uri: 'https://atf-m1.vercel.app/auth/mercadolivre/callback',
    }, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token, refresh_token, user_id, expires_in } = response.data;

    // Aqui você pode salvar isso no banco
    return reply.send({ access_token, user_id });
  } catch (err) {
    console.error(err.response?.data || err);
    return reply.status(500).send({ message: "Erro ao obter token do Mercado Livre" });
  }
};
