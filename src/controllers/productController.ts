import { FastifyReply, FastifyRequest } from "fastify";
import {
  AddFromProductService,
  DeleteFromFireStoreProductService,
  GetAllFromProductService,
  GetByIdFromProductService,
  GetByIdFromProductServiceByGtin,
  SetFromFireStoreProductService,
} from "../services/productService";
import { Product } from "../types/product";

interface IProductEan {
  ean: string;
}

interface IProductEanSet {
  data: Product;
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

export class DeleteFromFireStoreProductControllerWebProduct {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const service = new DeleteFromFireStoreProductService();
    const { data } = request.body as IProductEanSet;
    if (!data.id) {
      reply.status(404).send({ message: "Todos os campos sao necessarios " });
    }
    try {
      const resp = await service.execute("webProduct", data.id );
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}

export class AddFromProductServiceWebProduct {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const service = new AddFromProductService();
    const { data } = request.body as IProductEanSet;
    if (!data.gtin) {
      reply.status(404).send({ message: "Todos os campos sao necessarios " });
    }
    try {
      const resp: Product = await service.execute("webProduct", data);
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}
export class GetFromProductServiceWebProductByGtin {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { ean } = request.body as IProductEan;
    const service = new GetByIdFromProductServiceByGtin();
    try {
      const resp: Product = await service.execute("webProduct", ean);
      reply.status(200).send(resp);
    } catch (error) {
      console.log(error);
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}
export class SetFromFireStoreProductControllerWebProduct {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { data } = request.body as IProductEanSet;
    const { merge } = request.params as any;
    const service = new SetFromFireStoreProductService();
    try {
      const resp = await service.execute("webProduct", data, merge);
      reply.status(200).send(resp);
    } catch (error) {
      console.log(error);
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
      const resp: Product = await service.execute("webProduct", ean);
      reply.status(200).send(resp);
    } catch (error) {
      console.log(error);
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}
