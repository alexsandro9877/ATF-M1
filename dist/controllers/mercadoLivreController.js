import { responseToken, responseTokenCache, } from "../services/mercadoLivreService";
const mercadoLivreCallback = async (request, reply) => {
    try {
        reply.send("tokenReq");
    }
    catch (error) {
        //@ts-ignore
        reply.status(500).send({ message: error.message });
    }
};
class mercadolibreResToken {
    async handle(request, reply) {
        const ResponseToken = new responseToken();
        try {
            const tokenReq = await ResponseToken.execute();
            reply.send(tokenReq);
        }
        catch (error) {
            //@ts-ignore
            reply.status(500).send({ message: error.message });
        }
    }
}
class mercadolibreResCache {
    async handle(request, reply) {
        const ResponseTokenCache = new responseTokenCache();
        try {
            const tokenReq = await ResponseTokenCache.execute();
            reply.send(tokenReq);
        }
        catch (error) {
            //@ts-ignore
            reply.status(500).send({ message: error.message });
        }
    }
}
export { mercadolibreResToken, mercadoLivreCallback, mercadolibreResCache };
