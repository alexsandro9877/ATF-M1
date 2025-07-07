// authPlugin.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../lib/authService";


export async function authPlugin(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ message: "Token ausente" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    request.user = decoded;
  } catch (error) {
    return reply.status(401).send({ message: "Token inválido ou expirado" });
  }
}
