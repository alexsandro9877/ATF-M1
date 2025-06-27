import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authenticate } from "../hooks/authenticate";
import { admin } from "../lib/firebase";
export async function protectedRoutes(app: FastifyInstance) {
  app.addHook("onRequest", authenticate);

  app.get("/profile", async (request, reply) => {
    return { user: request.user }; // `request.user` vem do token Firebase
  });

  /// validando token do firebase passando o bearer
  app.post("/api/auth/firebase", async (req, reply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "Token não fornecido" });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      return { email: decoded.email, uid: decoded.uid };
    } catch (error) {
      return reply.status(401).send({ error: "Token inválido ou expirado" });
    }
  });

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
            <h2>Apresentação da aplicação FAWS-M1</h2>
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
