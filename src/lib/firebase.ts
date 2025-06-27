
import admin from 'firebase-admin';
<<<<<<< HEAD
=======
// import { readFileSync } from 'fs';
>>>>>>> 3be391f1ef9907b90e3bfa06f008ed12ba4375fd
import dotenv from 'dotenv';
dotenv.config();

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64!, "base64").toString("utf-8")
);
if (!admin.apps.length) {
//   const serviceAccount = JSON.parse(
//     readFileSync('./firebase-service-account.json', 'utf8')
//   );
<<<<<<< HEAD

=======
>>>>>>> 3be391f1ef9907b90e3bfa06f008ed12ba4375fd
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin };

<<<<<<< HEAD
=======

// 2. Configure o Firebase Admin
// Você precisa do arquivo JSON da conta de serviço. No Firebase Console:

// ⚙️ Configurações do projeto → Contas de serviço → Gerar nova chave privada
>>>>>>> 3be391f1ef9907b90e3bfa06f008ed12ba4375fd
