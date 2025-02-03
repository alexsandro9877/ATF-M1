//protectd.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function protectedRoutes(app: FastifyInstance) {
 
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
            content="Aplicação ATF-BACK-API"
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
