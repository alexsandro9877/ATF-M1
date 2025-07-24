import { FastifyReply, FastifyRequest } from "fastify";
import {
  responseToken,
  responseTokenCache,
  getMercadoLivreOrders,
  getCategoryAttributes,
  postPublicProduct
} from "../services/mercadoLivreService";

const mercadoLivreCallback = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    reply.send("tokenReq");
  } catch (error) {
    //@ts-ignore
    reply.status(500).send({ message: error.message });
  }
};



class mercadolibreResToken {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const ResponseToken = new responseToken();
    try {
      const tokenReq = await ResponseToken.execute();
      reply.send(tokenReq);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}

class mercadolibreResCache {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const ResponseTokenCache = new responseTokenCache();
    try {
      const tokenReq = await ResponseTokenCache.execute();
      reply.send(tokenReq);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}
class getMercadoLivreOrdersAll {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const RespGetMercadoLivreOrders = new getMercadoLivreOrders();
    try {
      const tokenReq = await RespGetMercadoLivreOrders.execute();
      reply.send(tokenReq);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}

class getCategoryAttributesController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
     const { categoryId } = request.params as { categoryId: string };
    const RespGetCategoryAttributes = new getCategoryAttributes();
    try {
      const response = await RespGetCategoryAttributes.execute(categoryId);
      reply.send(response);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}

class postPublicProductController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const payload: any = request.body;
    const PostPublicProduct = new postPublicProduct();
    try {
      const response = await PostPublicProduct.execute(payload);
      reply.status(200).send(response);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}

export { mercadolibreResToken, mercadoLivreCallback,postPublicProductController,getCategoryAttributesController, mercadolibreResCache ,getMercadoLivreOrdersAll};
