// // src/routes/firebase-users.ts
// import { FastifyInstance } from 'fastify';
// import { listUsers } from '../controllers/users-controller';
// import { authenticate } from '../hooks/authenticate'; // se quiser proteger a rota

// export async function firebaseUserRoutes(app: FastifyInstance) {
//   app.get('/firebase/users', { preHandler: [authenticate] }, listUsers);
// }
