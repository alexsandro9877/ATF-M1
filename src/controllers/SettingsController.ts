import { FastifyRequest, FastifyReply } from "fastify";
import{   
    ListSettingService,
    GetSettingByIdService,
    DeleteSettingsService,
    CreateUpdateSettingService,
    DeleteSettingsDetailService} from '../services/SettingService';
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
        const { id } = request.params as { id: string };

        try {
            const settings = await deleteSettingsService.execute(parseInt(id));
            reply.send(settings);
        } catch (error) {
            //@ts-ignore
            reply.status(500).send({ message: error.message });
        }
    }
}

class DeleteSettingsDetailController {
  
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const deleteSettingsDetailService = new DeleteSettingsDetailService();
        const { id } = request.params as { id: string };

        try {
            const settings = await deleteSettingsDetailService.execute(parseInt(id));
            reply.send(settings);
        } catch (error) {
            //@ts-ignore
            reply.status(500).send({ message: error.message });
        }
    }
}

class CreateSettingController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const createSettingService = new CreateUpdateSettingService();
        const objRecebido = request.body as ISettingBaseProps;
        try {
            const setting = await createSettingService.execute(objRecebido as ISettingBaseProps);
            
            reply.send(setting);
        } catch (error) {
            //@ts-ignore
            reply.status(400).send({ message: error.message });
        }
    }
}

export{ 
    ListSettingsController,
    GetSettingByIdController,
    DeleteSettingsController,
    CreateSettingController,
    DeleteSettingsDetailController
}