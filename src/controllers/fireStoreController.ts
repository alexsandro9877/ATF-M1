import { FastifyRequest, FastifyReply, errorCodes } from "fastify";
import {
  AddFromFireStoreService,
  DeleteFromFireStoreService,
  GetAllFromFireStoreService,
  UpdateFromFireStoreService,
  SetFromFireStoreService,
  GetByIdFromFireStoreService,
  GetFromMultipleCollectionsByIdService,
  AddToMultipleCollectionsWithSameIdService,
} from "../services/fireStoreService";

// Tipagem opcional para o body
interface WebBasePayload {
  email: string;
  senha: string;
}

interface IdPayload {
  id: string;
}

export class GetAllFromFireStoreServiceWebBase {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const service = new GetAllFromFireStoreService();
    try {
      const resp = await service.execute("webBase");
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}

export class AddFromFireStoreServiceWebBase {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { email, senha } = request.body as WebBasePayload;
    const service = new AddFromFireStoreService();
    try {
      const resp = await service.execute("webBase", { email, senha });
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(404).send({ message: error.message });
    }
  }
}

export class DeleteFromFireStoreServiceWebBase {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.body as IdPayload;
    const service = new DeleteFromFireStoreService();
    try {
      const resp = await service.execute("webBase", id);
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}

// Opcional: Controller para update
export class UpdateFromFireStoreServiceWebBase {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id, ...data } = request.body as { id: string; [key: string]: any };
    const service = new UpdateFromFireStoreService();
    try {
      const resp = await service.execute("webBase", id, data);
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}

// Opcional: Controller para set (sobrescrever ou merge)
export class SetFromFireStoreServiceWebBase {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id, merge = false, ...data } = request.body as {
      id: string;
      merge?: boolean;
      [key: string]: any;
    };
    const service = new SetFromFireStoreService();
    try {
      const resp = await service.execute("webBase", id, data, merge);
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}

export class GetByIdFromFireStoreServiceWebBase {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const service = new GetByIdFromFireStoreService();
    try {
      const resp = await service.execute("webBase", id);
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(404).send({ message: error.message });
    }
  }
}

export class AddToMultipleCollectionsWithSameIdController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const data = request.body as any;
    const service = new AddToMultipleCollectionsWithSameIdService();

    try {
      const resp = await service.execute(data, ["webBase", "webAudit"]);
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}


export class GetFromMultipleCollectionsByIdController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const service = new GetFromMultipleCollectionsByIdService();

    try {
      const resp = await service.execute(id, ["webBase", "webAudit"]);
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}

