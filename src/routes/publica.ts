import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {  singInFirebase,  createUserFirebase,} from "../controllers/firebaseUser";
import { admin } from "../lib/firebase";
import nodemailer from 'nodemailer';

export async function publica(app: FastifyInstance) {
  app.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    return new singInFirebase().handle(request, reply);
  });
  app.post("/cadastro",async (request: FastifyRequest, reply: FastifyReply) => {
      return new createUserFirebase().handle(request, reply);
    });
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fullautomatewebsolutions@gmail.com',
    pass: 'immggxbnsarwvkgj'
  }
});


// ✅ Etapa 2 – Gere uma senha de app
// Acesse: https://myaccount.google.com/apppasswords
// Faça login novamente, se necessário.
// Em Selecionar app, escolha Outro (nome personalizado) e digite algo como Nodemailer.
// Clique em Gerar.
// Copie a senha gerada (é algo como: abcd efgh ijkl mnop) – sem espaços.
  // Endpoint para envio de link de redefinição de senha por e-mail usando UID
  app.post("/api/send-reset-link", async (req, reply) => {
    const { email } = req.body as { email: string };
    if (!email) {
      return reply.status(400).send({ error: "E-mail é obrigatório" });
    }
    try {
       const actionCodeSettings = {
      url: "https://full-automate-site.vercel.app", // URL para onde o usuário será redirecionado após redefinir a senha
      handleCodeInApp: true,
    };

      // Gera o link de redefinição usando o UID
      const link = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);
      await transporter.sendMail({
        from: 'fullautomatewebsolutions@suport.com',
        to: email,
        subject: 'Redefinição de Senha',
        html: `
          <p>Olá,</p>
          <p>Você solicitou a redefinição da sua senha. Clique no botão abaixo:</p>
          <p><a href="${link}" style="padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Redefinir Senha</a></p>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p>${link}</p>
          <br/>
          <p>Se você não solicitou isso, ignore este e-mail.</p>
        `
      });
      return reply.status(200).send({ message: 'Link de redefinição enviado com sucesso!' });
    } catch (error: any) {
      console.error('Erro ao enviar e-mail:', error);
      return reply.status(500).send({
        message: 'Erro ao gerar ou enviar o link.',
        error: error.message,
        code: error.code
      });
    }
  });

   //criar um endpoint para criar um usuário
  app.post("/api/create-user", async (req, reply) => {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {      
      return reply.status(400).send({ error: "E-mail e senha são obrigatórios" });
    }
    try {
      const userRecord = await admin.auth().createUser({
      email,
      password,
      });
      // Definir claims padrão (exemplo: role user)
      await admin.auth().setCustomUserClaims(userRecord.uid, { role: ["user"] });
      return reply.status(201).send({ message: "Usuário criado com sucesso", uid: userRecord.uid });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message || "Erro ao criar usuário" });
    }});

     ///criar um endpoint que validate o emil do usuário
  app.post("/api/validate-email", async (req, reply) => {
    const actionCodeSettings = {
      url: "https://full-automate-site.vercel.app",
      handleCodeInApp: true,
    };
    const { email } = req.body as { email: string };
    if (!email) {
      return reply.status(400).send({ error: "E-mail é obrigatório" });
    }
    const link = await admin
      .auth()
      .generateEmailVerificationLink(email, actionCodeSettings);
    return reply.status(200).send({ link });
  });
}

