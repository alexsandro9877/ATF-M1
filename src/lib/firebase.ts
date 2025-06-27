
import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_CREDENTIALS_BASE64!, "base64").toString("utf-8")
);
if (!admin.apps.length) {
//   const serviceAccount = JSON.parse(
//     readFileSync('./firebase-service-account.json', 'utf8')
//   );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin };

