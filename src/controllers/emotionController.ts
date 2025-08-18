import { FastifyReply, FastifyRequest } from "fastify";
import { AddFromEmotionService, DeleteFromFireStoreEmotionService, Emotion, GetAllFromEmotionService, SetFromFireStoreEmotionService } from "../services/emotionServers";


export class GetAllFromEmotionServiceWebEmotion {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const service = new GetAllFromEmotionService();
    try {
      const resp= await service.execute("webEmotion");
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}
export class DeleteFromFireStoreEmotionControllerWebEmotion {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const service = new DeleteFromFireStoreEmotionService();
    const  id = request.params as string;
    if (!id) {
      reply.status(404).send({ message: "Todos os campos sao necessarios " });
    }
    try {
      const resp = await service.execute("webEmotion", id );
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}
export class AddFromEmotionServiceWebEmotion {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const service = new AddFromEmotionService();
    const  data  = request.body as Emotion;
    if (!data.action) {
      reply.status(404).send({ message: "Todos os campos sao necessarios " });
    }
    try {
      const resp = await service.execute("webEmotion", data);
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}
export class SetFromFireStoreEmotionControllerWebEmotion {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const  data  = request.body as Emotion;
    // const { merge } = request.params as any;
    const service = new SetFromFireStoreEmotionService();
    try {
      const resp = await service.execute("webEmotion", data, true);
      reply.status(200).send(resp);
    } catch (error) {
      console.log(error);
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}


