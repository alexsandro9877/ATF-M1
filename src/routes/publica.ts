import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { singInFirebase,createUserFirebase } from "../controllers/firebaseUser";
export async function publica(app: FastifyInstance) {

   app.post(
    "/login",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new singInFirebase().handle(request, reply);
    }
  );
     app.post(
    "/cadastro",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return new createUserFirebase().handle(request, reply);
    }
  );
   
}
