import { FastifyReply, FastifyRequest } from "fastify";
import {
  responseToken,
  responseTokenCache,
  getMercadoLivreOrders,
  getCategoryAttributes,
  postPublicProduct,
  searchProductByName,
  getItemDescription,
  searchProducts
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
class searchProductByNameController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    const { q } = request.query as { q: string };
    if (!q) {
      return reply.status(400).send({ error: "Parâmetro 'q' é obrigatório" });
    }
    
    const searchService = new searchProductByName();

    try {
      const result = await searchService.execute(q);
      reply.send(result);
    } catch (error: any) {
      reply.status(500).send({ message: error.message || "Erro interno" });
    }
  }
}


class getItemDescriptionController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { itemId } = request.params as { itemId: string };
    if (!itemId) {
      return reply.status(400).send({ error: "Parâmetro itemId é obrigatório" });
    }

    const service = new getItemDescription();

    try {
      const result = await service.execute(itemId);
      reply.send(result);
    } catch (error: any) {
      reply.status(500).send({ error: error.message || "Erro interno" });
    }
  }
}


class searchProductsController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { q, limit } = request.query as { q: string; limit?: string };

    if (!q) {
      return reply.status(400).send({ error: "Parâmetro 'q' é obrigatório" });
    }

    const service = new searchProducts();

    try {
      const data = await service.execute(q, limit ? Number(limit) : 10);
      if (data.status === 403) {
        return   reply.status(403).send({ data: data.error });
      }
      return reply.send(data);
    } catch (error: any) {
      reply.status(500).send({ error: error.message || "Erro interno" });
    }
  }
}
export { mercadolibreResToken,searchProductsController,searchProductByNameController,getItemDescriptionController, mercadoLivreCallback,postPublicProductController,getCategoryAttributesController, mercadolibreResCache ,getMercadoLivreOrdersAll};
