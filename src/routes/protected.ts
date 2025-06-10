//protectd.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {  ListSettingsController,
  GetSettingByIdController,
  DeleteSettingsController,
  CreateSettingController, 
  DeleteSettingsDetailController} from "../controllers/SettingsController";
<<<<<<< HEAD
  import {FinalizadoraController,getAllFinalizadorasController,getByIdFinalizadorasController,deleteByIdFinalizadorasController} from "../controllers/SettingsFinalizadoraController";

export async function protectedRoutes(app: FastifyInstance) {
  app.post(
    "/finalizadora",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new FinalizadoraController().handle(request, reply);
    }
  );
  app.get(
    "/finalizadora/all",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new getAllFinalizadorasController().handle(request, reply);
    }
  );
   app.get(
    "/finalizadora/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new getByIdFinalizadorasController().handle(request, reply);
    }
  );
   app.delete(
    "/finalizadora/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new deleteByIdFinalizadorasController().handle(request, reply);
    }
  );
  
=======
import axios from "axios";

export async function protectedRoutes(app: FastifyInstance) {

app.get('/api/auth/mercadolivre/callback', async (req, reply) => {
  const client_id = process.env.ML_CLIENT_ID!;
  const client_secret = process.env.ML_CLIENT_SECRET!;
  const redirect_uri = process.env.ML_REDIRECT_URI!;

  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('client_id', client_id);
  params.append('client_secret', client_secret);
  params.append('redirect_uri', redirect_uri);

    
  try {
    const response = await axios.post(
      'https://api.mercadolibre.com/oauth/token',
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return reply.send(response.data);
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return reply.status(400).send({ error: error.response?.data || error.message });
  }
});
//    app.get(
//     "/api/auth/mercadolivre/callback",
//     async (request: FastifyRequest, reply: FastifyReply) => {

//       const { code } = request.query as { code: string };
//   const client_id = process.env.ML_CLIENT_ID!;
//   const client_secret = process.env.ML_CLIENT_SECRET!;
//   const redirect_uri = process.env.ML_REDIRECT_URI!;

//   const response = await axios.post('https://api.mercadolibre.com/oauth/token', {
//     grant_type: 'authorization_code',
//     client_id,
//     client_secret,
//     code,
//     redirect_uri,
//   }, {
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//   });

//   const { access_token, refresh_token, expires_in, user_id } = response.data;

//   // Salve em banco ou envie como resposta
//   return reply.send({ access_token, refresh_token, expires_in, user_id });
//     }
//   );
//  app.get(
//     "/api/auth/mercadolivre/login",
//     async (request: FastifyRequest, reply: FastifyReply) => {

//       const redirect_uri = process.env.ML_REDIRECT_URI!;
//   const client_id = process.env.ML_CLIENT_ID!;
//   const url = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;
// reply.redirect(url);
      
//     }
//   );

>>>>>>> 1cac3a87f4ee33307694e064038e1f2c17e0213d
  app.get(
    "/settings/all",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new ListSettingsController().handle(request, reply);
    }
  );
  app.get(
    "/settings/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new GetSettingByIdController().handle(request, reply);
    }
  );
  app.delete(
    "/settings/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new DeleteSettingsController().handle(request, reply);
    }
  );
  app.delete(
    "/settings/detail/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new DeleteSettingsDetailController().handle(request, reply);
    }
  );
  app.post(
    "/settings",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new CreateSettingController().handle(request, reply);
    }
  );


  /// Rota retorna a tela de apresentação da api
  app.get("/", async (req, reply) => {
    return reply.status(200).type("text/html").send(html);
  });

  const html = `
     <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css"
            />
            <title>Automatfull</title>
            <meta
            name="description"
            content="Aplicação ATF-M1"
            />
        </head>
        <body>
            <h1>Criado por Automatfull</h1>
            <h2>Apresentação da aplicação ATF-BACK-API</h2>
            <p>
            Esta é uma aplicação inicial para Vercel + Fastify. As requisições são
            reescritas de <code>/*</code> para <code>//*</code>, que são executadas
            como uma Função Vercel.
            </p>
            <p>Entre em contato pelo telefone: (11) 98100-7578, para acesso a consumo e desenvolvimento de software</p>
            <p>
            Automatfull
            </p>
        </body>
        </html>

      `;
}
