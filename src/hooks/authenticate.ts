<<<<<<< HEAD
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


=======

import { FastifyRequest, FastifyReply } from 'fastify';
import { admin } from '../lib/firebase';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ message: 'Token ausente' });
    }

    const idToken = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    request.user = decodedToken; // você pode usar isso nos handlers depois

  } catch (error) {
    console.error('Erro na autenticação Firebase:', error);
    return reply.status(401).send({ message: 'Token inválido' });
  }
}
>>>>>>> 3be391f1ef9907b90e3bfa06f008ed12ba4375fd
