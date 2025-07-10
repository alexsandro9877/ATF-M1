import { FastifyReply, FastifyRequest } from "fastify";
import { GetAllFromProductService, GetByIdFromProductService } from "../services/productService";
import { Product } from "../types/product";

interface IProductEan{
    ean : string
}



export class GetAllFromProductServiceWebProduct {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const service = new GetAllFromProductService();
    try {
      const resp: Product = await service.execute("webProduct");
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}

export class GetFromProductServiceWebProduct {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { ean } = request.body as IProductEan;
    const service = new GetByIdFromProductService();
    try {
      const resp: Product = await service.execute("webProduct", ean );
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}

