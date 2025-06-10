import fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import dotenv from 'dotenv';
import { routes } from '../src/routes/routes';
import fastifyMultipart from '@fastify/multipart';
import fastifyJwt from '@fastify/jwt';

dotenv.config();
const port = parseInt(process.env.PORT || '3000', 10); 


const app = fastify({ 
    logger: true,
    bodyLimit: 1048576, // Limite de 1MB (por exemplo)
    pluginTimeout: 120000, // 2 minutos de timeout para plugins

});


const start = async () => {
    try {
        await app.register(cors);
        await app.register(fastifyCookie);
        await app.register(fastifyMultipart);
        // await app.register(fastifyJwt, {
        //     secret: process.env.JWT_SECRET!,
        // });

        app.register(routes);

       // Middleware de autenticação para proteger rotas
        // app.addHook('onRequest', async (request, reply) => {
        //     if (request.routerPath !== '/login' && request.routerPath !== '/refresh') {
        //         try {
        //             await request.jwtVerify();
        //         } catch (err) {
        //             reply.send(err);
        //         }
        //     }
        // });
        

        await app.listen({ port, host: '0.0.0.0' });
        await app.ready()
       // app.server.emit('request', req, reply)
        console.log(`Server is running on http://localhost:${port}`);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

start();