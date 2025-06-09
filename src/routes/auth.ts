// import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
// // import { GetUserByEmailService } from '../services/UsersService';
// import fastifyJwt from '@fastify/jwt';
// Exemplo: /auth/mercadolivre
//@ts-ignore
const redirectUri = encodeURIComponent(process.env.ML_REDIRECT_URI);
const clientId = process.env.ML_CLIENT_ID;

const authUrl = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;


// export async function authRoutes(app: FastifyInstance) {
//     app.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
//         const { username, password } = request.body as { username: string, password?: string };

//         if (!username ) {
//             return reply.status(400).send({ message: 'Username and password are required' });
//         }

//         try {
//             const getUserByEmailService = new GetUserByEmailService();
//             const user = await getUserByEmailService.execute(username);

//             if (!user) {
//                 return reply.status(401).send({ message: 'Invalid credentials' });
//             }

//             if (!user.status) {
//                 return reply.status(403).send({ message: 'User is blocked' });
//             }

//             // const isPasswordValid = await verifyPassword(user, password);

//             // if (!isPasswordValid) {
//             //     return reply.status(401).send({ message: 'Invalid credentials' });
//             // }

//             const accessToken = app.jwt.sign({ username }, { expiresIn: '15m' });
//             const refreshToken = app.jwt.sign({ username }, { expiresIn: '7d' });

//             const { exp: accessTokenExp } = app.jwt.decode(accessToken) as { exp: number };
//             const expiresIn = accessTokenExp - Math.floor(Date.now() / 1000);

//             return reply.send({ 
//                 accessToken, 
//                 refreshToken, 
//                 expires_in: expiresIn // tempo restante em segundos
//             });
//         } catch (error) {
//             app.log.error(error);
//             return reply.status(500).send({ message: 'Internal Server Error' });
//         }
//     });

//     app.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
//         const { refreshToken } = request.body as { refreshToken: string };

//         if (!refreshToken) {
//             return reply.status(400).send({ message: 'Refresh token is required' });
//         }

//         try {
//             const payload = app.jwt.verify(refreshToken) as { username: string };
//             const newAccessToken = app.jwt.sign({ username: payload.username }, { expiresIn: '1m' });

//             const { exp: accessTokenExp } = app.jwt.decode(newAccessToken) as { exp: number };
//             const expiresIn = accessTokenExp - Math.floor(Date.now() / 1000);

//             return reply.send({ 
//                 accessToken: newAccessToken, 
//                 expires_in: expiresIn // tempo restante em segundos
//             });
//         } catch (err) {
//             return reply.status(401).send({ message: 'Invalid refresh token' });
//         }
//     });
// }

// // Implemente essa função conforme necessário
// async function verifyPassword(user: any, password: string): Promise<boolean> {
//     // Verifique a senha do usuário aqui
//     // Retorne true se a senha for válida, caso contrário, retorne false
//     return user.password === password; // Exemplo básico, substitua com a lógica de hash/senha real
// }
