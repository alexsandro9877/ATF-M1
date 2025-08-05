import { FastifyReply, FastifyRequest } from "fastify";
import { AddFromFireStoreStoreService, DeleteFromFireStoreStoreService, GetAllFromFireStoreStoreService, UpdateFromFireStoreStoreService } from "../services/storeService";
import { Loja } from "../services/fireStoreService";

export class AddFromFireStoreStoreController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const  values  = request.body  as Loja;
    const service = new AddFromFireStoreStoreService();
    try {
      const resp = await service.execute("webStore",  values);
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(404).send({ message: error.message });
    }
  }
}



export class GetAllFromFireStoreStoreController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const service = new GetAllFromFireStoreStoreService();
    try {
      const resp = await service.execute("webStore");
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}

export class UpdateFromFireStoreController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id, ...data } = request.body as { id: string; [key: string]: any };
    const service = new UpdateFromFireStoreStoreService();
    try {
      const resp = await service.execute("webStore", id, data);
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}

export class DeleteFromFireStoreController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.body as any;
    const service = new DeleteFromFireStoreStoreService();
    try {
      const resp = await service.execute("webStore", id);
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}