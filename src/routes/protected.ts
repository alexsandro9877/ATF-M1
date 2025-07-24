import { FastifyInstance } from "fastify";
import { authenticate } from "../hooks/authenticate";
import { admin } from "../lib/firebase";
export async function protectedRoutes(app: FastifyInstance) {
  app.addHook("onRequest", authenticate);

  app.get("/profile", async (request, reply) => {
      const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "Token não fornecido" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    await admin.auth().getUser(decoded.uid);
    return { user: request.user }; // `request.user` vem do token Firebase

    //     {
    //   "user": {
    //     "role": "user",                           Custom Claim (definido por você)
    //     "iss": "https://securetoken.google.com/fullautomatewebsolution",  Emissor
    //     "aud": "fullautomatewebsolution",         Público-alvo (seu projeto Firebase)
    //     "auth_time": 1751051260,                  Horário da autenticação (epoch)
    //     "user_id": "aWFFrJjpqfSZnxKfQvq7eU1Aywv1", UID do usuário (igual abaixo)
    //     "sub": "aWFFrJjpqfSZnxKfQvq7eU1Aywv1",    Sujeito do token (mesmo que UID)
    //     "iat": 1751051260,                        Emitido em (Issued At - epoch)
    //     "exp": 1751054860,                        Expiração do token (epoch)
    //     "email": "alex.sandroalvesdelima@hotmail.com",  E-mail do usuário
    //     "email_verified": false,                  E-mail verificado?
    //     "firebase": {
    //       "identities": {
    //         "email": ["alex.sandroalvesdelima@hotmail.com"]
    //       },
    //       "sign_in_provider": "password"          Método usado para login
    //     },
    //     "uid": "aWFFrJjpqfSZnxKfQvq7eU1Aywv1"      UID do usuário (único no projeto)
    //   }
    // }

    // quando expira o getToken;

    // const exp = 1751054860;
    // const date = new Date(exp * 1000);
    // console.log(date.toLocaleString());
  });

  /// validando token do firebase passando o bearer e so para teste
  app.post("/api/auth/firebase", async (req, reply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "Token não fornecido" });
    }
    const token = authHeader.split(" ")[1];
    try {
      const decoded = await admin.auth().verifyIdToken(token);

      /// criar uma logica caso receber o token de um usuario google
      // const credential = admin.auth.GoogleAuthProvider.credential(googleIdToken);

      ///pegar imagem ja existente do usuario
      //  const userRecord = await admin.auth().getUser(decoded.uid);
      //   console.log(userRecord.providerData[0].photoURL);
      // await admin.auth().deleteUsers;
      // ///definindo claims role
      // await admin
      //   .auth()
      //   .setCustomUserClaims(decoded.uid, { role: ["user", "1"] }); // ou qualquer outro papel: 'user', 'editor', etc.
      // //definir uma imagem para o usuario
      // await admin
      //   .auth()
      //   .updateUser(decoded.uid, {
      //     photoURL: "https://cdn-icons-png.flaticon.com/512/17/17004.png",
      //   });
      const user = await admin.auth().getUser(decoded.uid); //Forçar o refresh do token no client: Após definir os claims, o token só será atualizado no próximo login ou se você forçar com:

      return { ...user };
      // return { email: decoded.email, uid: decoded.uid, role: decoded.role };
    } catch (error) {
      return reply.status(401).send({ error: "Token inválido ou expirado" });
    }
  });
 
  //criar endpoint para listar todos os usuários
  app.get("/api/users", async (req, reply) => {
    const result = await admin.auth().listUsers(1000, "10"); // até 1000 por chamada
    result.users.forEach((user) => {
      console.log({
        uid: user.uid,
        email: user.email,
        role: user.customClaims?.role || "sem role",
      });
    });

    return { result };
  });
  //criar endpoint para redefinir senha do usuário
  app.post("/api/reset-password", async (req, reply) => {
    const { email } = req.body as { email: string };

    const actionCodeSettings = {
      url: "https://full-automate-site.vercel.app", // URL para onde o usuário será redirecionado após redefinir a senha
      handleCodeInApp: true,
    }; /// essa configuração é importante para o link de redefinição de senha funcionar corretamente so (online)
    if (!email) {
      return reply.status(400).send({ error: "E-mail é obrigatório" });
    }
    const link = await admin
      .auth()
      .generatePasswordResetLink(email, actionCodeSettings);
    return reply.status(200).send({ link });

    //   1. Acesse o Firebase Console:
    // https://console.firebase.google.com/

    // Vá para o seu projeto: fullautomatewebsolution

    // 2. Vá em:
    // Autenticação > Configurações > Domínios autorizados

    // 3. Adicione o domínio que você usou em actionCodeSettings.url
    // Por exemplo:

    // Se você passou isso no código:

    // ts
    // Copiar
    // Editar
    // const actionCodeSettings = {
    //   url: 'https://full-automate-site.vercel.app/apos-reset',
    //   handleCodeInApp: true
    // };
    // ➡️ Adicione o domínio: full-automate-site.vercel.app
  });
 
 // criar um endpoint para trocar o email da conta do usuário
  app.post("/api/change-email", async (req, reply) => {
    const {  uid,    email } = req.body as {      email: string;      uid: string;    };
    const actionCodeSettings = {
    url: 'https://ecommerce-app-five-phi.vercel.app/',
    handleCodeInApp: true
  };
    if (!email || !uid) {
      return reply.status(400).send({ error: "E-mail é obrigatório e uid" });
    }
    try {
    const link = await admin.auth().generateVerifyAndChangeEmailLink(
    uid,
    email,
    actionCodeSettings
  );
      return reply.status(200).send({ message: "E-mail atualizado com sucesso" + link});
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao atualizar o e-mail" });
    }
  })
  //criar um endpoint para deletar usuarios 
  app.post("/api/delete-user", async (req, reply) => {
    const { uid } = req.body as { uid: string };
    if (!uid) {
      return reply.status(400).send({ error: "UID é obrigatório" });
    }
    try {
      await admin.auth().deleteUser(uid);
      return reply.status(200).send({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao deletar o usuário" });
    }
  });
  //criar um endpont para adicionar a role ao usuário
  app.post("/api/add-role", async (req, reply) => {  
    const { uid, role } = req.body as { uid: string; role: string };
    if (!uid || !role) {
      return reply.status(400).send({ error: "UID e role são obrigatórios" });
    }
    try {
      await admin.auth().setCustomUserClaims(uid, { role });
      return reply.status(200).send({ message: `Role ${role} adicionada ao usuário ${uid}` });
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao adicionar a role" });
    }
  })
  //criar um endpoint para remover a role do usuário
  app.post("/api/remove-role", async (req, reply) => {  
    const { uid, role } = req.body as { uid: string; role: string };
    if (!uid || !role) {
      return reply.status(400).send({ error: "UID e role são obrigatórios" });
    }
    try {
      // Primeiro, obter os claims existentes
      const user = await admin.auth().getUser(uid);
      const claims = user.customClaims || {};

      // Remover apenas a role especificada
      if (claims.role && Array.isArray(claims.role)) {
        claims.role = claims.role.filter((r: string) => r !== role);
      }

      // Atualizar as claims
      await admin.auth().setCustomUserClaims(uid, claims);
      return reply.status(200).send({ message: `Role ${role} removida do usuário ${uid}` });
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao remover a role" });
    }
  });
  // Endpoint para substituir todas as roles do usuário por uma nova lista
  app.post("/api/set-roles", async (req, reply) => {
    const { uid, roles } = req.body as { uid: string; roles: string[] };
    if (!uid || !Array.isArray(roles)) {
      return reply.status(400).send({ error: "UID e lista de roles são obrigatórios" });
    }
    try {
      await admin.auth().setCustomUserClaims(uid, { role: roles });
      return reply.status(200).send({ message: `Roles atualizadas para o usuário ${uid}`, roles });
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao atualizar as roles" });
    }
  });
  // Endpoint para alternar o status "disabled" de um usuário
  app.post("/api/disable-user", async (req, reply) => {
    const { uid, disabled } = req.body as { uid: string; disabled: boolean };
    if (typeof uid !== "string" || typeof disabled !== "boolean") {
      return reply.status(400).send({ error: "UID e status atual (disabled) são obrigatórios" });
    }
    try {
      const newStatus = !disabled;
      await admin.auth().updateUser(uid, { disabled: newStatus });
      return reply.status(200).send({ 
        message: `Usuário ${newStatus ? "desabilitado" : "habilitado"} com sucesso`,
        disabled: newStatus
      });
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao atualizar o status do usuário" });
    }
  });
 ///Atualizar a photo
  app.post("/api/update-photo", async (req, reply) => {
    const { uid, photoURL } = req.body as { uid: string; photoURL: string };
    if (!uid || !photoURL) {
      await admin.auth().getUser(uid); 
      return reply.status(400).send({ error: "UID e photoURL são obrigatórios" });
    }
    try {
      await admin.auth().updateUser(uid, { photoURL });
      return reply.status(200).send({ message: "Foto atualizada com sucesso" });
    } catch (error) {
      return reply.status(500).send({ error: "Erro ao atualizar a foto do usuário" });
    }
  });



// app.post('/api/reset-password', async (req, res) => {
//   const { email } = req.body as { email: string };
//   if (!email)  return res.status(400).send({ error: "e-mail é obrigatório." });

//   try {
//     const emailUser = await admin.auth().getUserByEmail(email)
//    const link = await admin
//       .auth()
//       .generatePasswordResetLink(email);
//     // const link = await admin.auth().generatePasswordResetLink(emailUser.uid);
//     console.log(link)
//     // await transporter.sendMail({
//     //   from: 'fullautomatewebsolutions@gmail.com',
//     //   to: email,
//     //   subject: 'Redefinição de Senha',
//     //   html: `
//     //     <p>Olá,</p>
//     //     <p>Você solicitou a redefinição da sua senha. Clique no botão abaixo:</p>
//     //     <p><a href="${link}" style="padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Redefinir Senha</a></p>
//     //     <p>Ou copie e cole este link no seu navegador:</p>
//     //     <p>${link}</p>
//     //     <br/>
//     //     <p>Se você não solicitou isso, ignore este e-mail.</p>
//     //   `
//     // });

//     res.status(200).send({ message: 'Link de redefinição enviado com sucesso!' });
//   } catch (error: any) {
//     console.error('Erro ao enviar e-mail:', error);
//     res.status(500).send({
//       message: 'Erro ao gerar ou enviar o link.',
//       error: error.message,
//       code: error.code
//     });
//   }
// });


///  O que é um "tenant"?
// Um tenant (ou inquilino) representa uma organização, empresa ou cliente diferente no seu sistema, cada um com:
// seus próprios usuários,
// provedores de login,
// configurações personalizadas.
// Isso é especialmente útil para SaaS com múltiplos clientes.

// Método	O que faz
// createTenant()	Cria um novo tenant
// getTenant(tenantId)	Obtém os dados de um tenant existente
// listTenants()	Lista todos os tenants
// updateTenant(tenantId, data)	Atualiza as configurações de um tenant
// deleteTenant(tenantId)	Remove um tenant


  // Listar todos os tenants
//   const result = await admin.auth().tenantManager().listTenants(100);
// result.tenants.forEach(t => {
//   console.log(t.tenantId, t.displayName);
// });


//  Importante:
// O recurso Multi-Tenancy está disponível somente no Firebase Authentication para clientes do plano Blaze (pago).
// É necessário ativar o suporte a tenants no Firebase Console > Autenticação > Multi-tenancy.

//  Quando usar Multi-Tenancy
// Use tenantManager se:
// Seu app serve vários clientes independentes (ex: um sistema white-label).
// Você precisa isolar usuários de diferentes organizações.
// Você quer controlar provedores de login separados por cliente.

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
