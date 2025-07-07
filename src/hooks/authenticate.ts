import { FastifyRequest, FastifyReply } from "fastify";
import { admin } from "../lib/firebase";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ message: "Token ausente" });
    }
    
    const idToken = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    request.user = decodedToken; // usar isso nos handlers depois
  } catch (error) {
    console.error("Erro na autenticação Firebase:", error);
    return reply.status(401).send({ message: "Token inválido" });
  }
}



//  Requisitos:
// Ter um arquivo serviceAccountKey.json que você baixa no Firebase Console:
// Acesse: https://console.firebase.google.com/
// Vá em Configurações do Projeto > Contas de Serviço
// Clique em Gerar nova chave privada
// Adicionar essa chave ao seu backend (não subir para o GitHub!).
