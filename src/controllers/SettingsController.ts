import { FastifyRequest, FastifyReply } from "fastify";
import{   
    ListSettingService,
    GetSettingByIdService,
    DeleteSettingsService,
    CreateSettingService} from '../services/SettingService';
import { ISettingBaseProps } from "../types/types";


class ListSettingsController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const listSettingService = new ListSettingService();

        try {
            const settings = await listSettingService.execute();
            reply.send(settings);
        } catch (error) {
            //@ts-ignore
            reply.status(500).send({ message: error.message });
        }
    }
}

class GetSettingByIdController {
  
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const getSettingByIdService = new GetSettingByIdService();
        const { id } = request.params as { id: number };

        try {
            const settings = await getSettingByIdService.execute(id);
            reply.send(settings);
        } catch (error) {
            //@ts-ignore
            reply.status(500).send({ message: error.message });
        }
    }
}

class DeleteSettingsController {
  
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const deleteSettingsService = new DeleteSettingsService();
        const { id } = request.params as { id: number };

        try {
            const settings = await deleteSettingsService.execute(id);
            reply.send(settings);
        } catch (error) {
            //@ts-ignore
            reply.status(500).send({ message: error.message });
        }
    }
}

class CreateSettingController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const createSettingService = new CreateSettingService();
        const objComplet = request.body as ISettingBaseProps

        try {
            const setting = await createSettingService.execute({...objComplet });
            reply.send(setting);
        } catch (error) {
            //@ts-ignore
            reply.status(400).send({ message: error.message });
        }
    }
}

export{ ListSettingsController,
    GetSettingByIdController,
    DeleteSettingsController,
    CreateSettingController}