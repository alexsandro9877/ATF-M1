import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  singInFirebase,
  createUserFirebase,
} from "../controllers/firebaseUser";
import { admin } from "../lib/firebase";
import nodemailer from "nodemailer";
import { generateToken } from "../lib/authService";
import {
  AddFromProductServiceWebProduct,
  DeleteFromFireStoreProductControllerWebProduct,
  GetAllFromProductServiceWebProduct,
  GetFromProductServiceWebProduct,
  GetFromProductServiceWebProductByGtin,
  SetFromFireStoreProductControllerWebProduct,
} from "../controllers/productController";
import { addByInventoryProductController, addByInventoryProductMovimentoController, getAllByInventoryProductController, getAllByInventoryProductMovimentoController } from "../controllers/inventoryController";
import { AddFromFireStoreStoreController, DeleteFromFireStoreController, GetAllFromFireStoreStoreController, UpdateFromFireStoreController } from "../controllers/storeController";
import { AddFromEmotionServiceWebEmotion, DeleteFromFireStoreEmotionControllerWebEmotion, GetAllFromEmotionServiceWebEmotion, SetFromFireStoreEmotionControllerWebEmotion } from "../controllers/emotionController";


export async function publica(app: FastifyInstance) {

  app.post("/add_inventory", async (request: FastifyRequest, reply: FastifyReply) => { 
      return new addByInventoryProductController().handle(request, reply);
    }
  );
  app.post("/add_movimento", async (request: FastifyRequest, reply: FastifyReply) => {
      return new addByInventoryProductMovimentoController().handle(request, reply);
    }
  );
   app.get("/get_est_product", async (request: FastifyRequest, reply: FastifyReply) => {
      return new getAllByInventoryProductController().handle(request, reply);
    }
  );
  app.post("/get_movimento", async (request: FastifyRequest, reply: FastifyReply) => {
      return new getAllByInventoryProductMovimentoController().handle(request, reply);
    }
  );
  app.post("/tokenStore", async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    // Aqui você valida o usuário na sua base
    if (email === "teste@teste.com" && password === "123456") {
      const token = generateToken({ userId: "teste", email });
      console.log(token);
      return reply.send({ token });
    }

    return reply.status(401).send({ message: "Credenciais inválidas" });
  });
  app.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      return new singInFirebase().handle(request, reply);
    } catch (error: any) {
      return reply.status(401).send({ error: "Usuário não cadastrado" });
    }
  });
  app.post("/cadastro",async (request: FastifyRequest, reply: FastifyReply) => {
      return new createUserFirebase().handle(request, reply);
    }
  );
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "fullautomatewebsolutions@gmail.com",
      pass: "immggxbnsarwvkgj",
    },
  });
  app.post("/search_into_product",async (request: FastifyRequest, reply: FastifyReply) => {
      return new GetFromProductServiceWebProduct().handle(request, reply);
    }
  );
  app.get("/search_all_product", async (request: FastifyRequest, reply: FastifyReply) => {
      return new GetAllFromProductServiceWebProduct().handle(request, reply);
    }
  );
  app.post("/search_byGtin_product", async (request: FastifyRequest, reply: FastifyReply) => {
      return new GetFromProductServiceWebProductByGtin().handle(request, reply);
    }
  );
  app.post("/search_set_product", async (request: FastifyRequest, reply: FastifyReply) => {
      return new SetFromFireStoreProductControllerWebProduct().handle(request, reply);
    }
  );
  app.post("/search_delete_product", async (request: FastifyRequest, reply: FastifyReply) => {
      return new DeleteFromFireStoreProductControllerWebProduct().handle(request, reply);}
  );
  app.post("/search_new_product", async (request: FastifyRequest, reply: FastifyReply) => {
      return new AddFromProductServiceWebProduct().handle(request, reply);
    }
  );
   app.post("/add_store", async (request: FastifyRequest, reply: FastifyReply) => {
      return new AddFromFireStoreStoreController().handle(request, reply);
    }
  );
   app.get("/get_store", async (request: FastifyRequest, reply: FastifyReply) => {
      return new GetAllFromFireStoreStoreController().handle(request, reply);
    }
  );
  app.post("/add_store/att", async (request: FastifyRequest, reply: FastifyReply) => {
      return new UpdateFromFireStoreController().handle(request, reply);
    }
  );
  app.post("/delete_store", async (request: FastifyRequest, reply: FastifyReply) => {
      return new DeleteFromFireStoreController().handle(request, reply);
    }
  );


  
    app.post("/api/emotion", async (request, reply) => {
      await new AddFromEmotionServiceWebEmotion().handle(request, reply);
    }); 
     app.get("/api/emotion", async (request, reply) => {
      await new GetAllFromEmotionServiceWebEmotion().handle(request, reply);
    });
    
    app.put("/api/emotion", async (request, reply) => {
      await new SetFromFireStoreEmotionControllerWebEmotion().handle(request, reply);
    });

    app.delete("/api/emotion/:id", async (request, reply) => {
      await new DeleteFromFireStoreEmotionControllerWebEmotion().handle(request, reply);
    });
  
  
  



  // Etapa 2 – Gere uma senha de app
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
        url: "https://ecommerce-app-five-phi.vercel.app/", // URL para onde o usuário será redirecionado após redefinir a senha
        handleCodeInApp: true,
      };

      // Gera o link de redefinição usando o UID
      const link = await admin
        .auth()
        .generatePasswordResetLink(email, actionCodeSettings);
      await transporter.sendMail({
        from: "fullautomatewebsolutions@suport.com",
        to: email,
        subject: "Redefinição de Senha",
        html: `
          <p>Olá,</p>
          <p>Você solicitou a redefinição da sua senha. Clique no botão abaixo:</p>
          <p><a href="${link}" style="padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Redefinir Senha</a></p>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p>${link}</p>
          <br/>
          <p>Se você não solicitou isso, ignore este e-mail.</p>
        `,
      });
      return reply
        .status(200)
        .send({ message: "Link de redefinição enviado com sucesso!" });
    } catch (error: any) {
      console.error("Erro ao enviar e-mail:", error);
      return reply.status(500).send({
        message: "Erro ao gerar ou enviar o link.",
        error: error.message,
        code: error.code,
      });
    }
  });
  //criar um endpoint para criar um usuário
  app.post("/api/create-user", async (req, reply) => {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      return reply
        .status(400)
        .send({ error: "E-mail e senha são obrigatórios" });
    }
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });
      // Definir claims padrão (exemplo: role user)
      await admin
        .auth()
        .setCustomUserClaims(userRecord.uid, { role: ["user"] });
      return reply
        .status(201)
        .send({ message: "Usuário criado com sucesso", uid: userRecord.uid });
    } catch (error: any) {
      return reply
        .status(500)
        .send({ error: error.message || "Erro ao criar usuário" });
    }
  });
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

    /* Exemplo de imagem no e-mail (pode ser um logo ou banner) */
    const logoUrl =
      "https://full-automate-site.vercel.app/assets/logo-DX0kfNEl.png";

    await transporter.sendMail({
      from: "fullautomatewebsolutions@suport.com",
      to: email,
      subject: "Confirmação de E-mail - Full Automate",
      html: `
          <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
            <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 32px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <img src="${logoUrl}" alt="Full Automate" style="max-width: 120px; margin-bottom: 16px;" />
              </div>
              <h2 style="color: #222; text-align: center;">Confirmação de E-mail</h2>
              <p>Olá,</p>
              <p>Recebemos uma solicitação para confirmar o seu endereço de e-mail na plataforma <b>Full Automate</b>.</p>
              <p>Para concluir seu cadastro e garantir a segurança da sua conta, clique no botão abaixo:</p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${link}" style="display: inline-block; padding: 12px 32px; background: #007bff; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                  Confirmar E-mail
                </a>
              </div>
              <p>Ou copie e cole este link no seu navegador:</p>
              <p style="word-break: break-all; color: #555;">${link}</p>
              <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;">
              <p style="font-size: 13px; color: #888;">
                Se você não solicitou esta confirmação, apenas ignore este e-mail.<br>
                Em caso de dúvidas, entre em contato com nosso suporte.
              </p>
            </div>
          </div>
        `,
    });
    return reply
      .status(200)
      .send({ message: "Link de verificação enviado com sucesso!" });
  });
}
