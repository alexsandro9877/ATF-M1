import { FastifyReply, FastifyRequest } from "fastify";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp } from "firebase/app";


const firebaseConfig = JSON.parse(
  Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64_LOGIN!, "base64").toString("utf-8")
);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export class singInFirebase {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const {email,senha} = request.body as {senha: string, email: string} ;
    try {
   const userCredential =  await signInWithEmailAndPassword(auth, email, senha);
      const token:string = await userCredential.user.getIdToken();
      reply.send(token);
      reply.status(200);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}
export class createUserFirebase {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const {email,senha} = request.body as {senha: string, email: string} ;
    try {
   const userCredential =  await createUserWithEmailAndPassword(auth, email, senha);
      const token:string = await userCredential.user.getIdToken();
      reply.send(token);
      reply.status(200);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}

