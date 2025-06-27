import { FastifyReply, FastifyRequest } from "fastify";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { admin } from "../lib/firebase";


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

//// sobre trabalhar com role no firebase

// adicionar role ao usuario
// import admin from 'firebase-admin';

// // Supondo que o Firebase já esteja inicializado
// await admin.auth().setCustomUserClaims(uid, {
//   role: 'admin' // ou qualquer outro papel: 'user', 'editor', etc.
// });



// deletar a role
// // Primeiro, obter os claims existentes
// const user = await admin.auth().getUser(uid);
// const claims = user.customClaims || {};

// // Remover apenas o role
// delete claims.role;

// // Atualizar as claims
// await admin.auth().setCustomUserClaims(uid, claims);



// verificar role no usuario
// const checkAdmin = async (req, res, next) => {
//   const idToken = req.headers.authorization?.split('Bearer ')[1];

//   const decoded = await admin.auth().verifyIdToken(idToken);
//   if (decoded.role === 'admin') {
//     next();
//   } else {
//     res.status(403).send('Access denied');
//   }
// };
