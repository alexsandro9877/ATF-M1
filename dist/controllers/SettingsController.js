import { ListSettingService, GetSettingByIdService, DeleteSettingsService, CreateUpdateSettingService, DeleteSettingsDetailService } from '../services/SettingService';
class ListSettingsController {
    async handle(request, reply) {
        const listSettingService = new ListSettingService();
        try {
            const settings = await listSettingService.execute();
            reply.send(settings);
        }
        catch (error) {
            //@ts-ignore
            reply.status(500).send({ message: error.message });
        }
    }
}
class GetSettingByIdController {
    async handle(request, reply) {
        const getSettingByIdService = new GetSettingByIdService();
        const { id } = request.params;
        try {
            const settings = await getSettingByIdService.execute(id);
            reply.send(settings);
        }
        catch (error) {
            //@ts-ignore
            reply.status(500).send({ message: error.message });
        }
    }
}
class DeleteSettingsController {
    async handle(request, reply) {
        const deleteSettingsService = new DeleteSettingsService();
        const { id } = request.params;
        try {
            const settings = await deleteSettingsService.execute(parseInt(id));
            reply.send(settings);
        }
        catch (error) {
            //@ts-ignore
            reply.status(500).send({ message: error.message });
        }
    }
}
class DeleteSettingsDetailController {
    async handle(request, reply) {
        const deleteSettingsDetailService = new DeleteSettingsDetailService();
        const { id } = request.params;
        try {
            const settings = await deleteSettingsDetailService.execute(parseInt(id));
            reply.send(settings);
        }
        catch (error) {
            //@ts-ignore
            reply.status(500).send({ message: error.message });
        }
    }
}
class CreateSettingController {
    async handle(request, reply) {
        const createSettingService = new CreateUpdateSettingService();
        const objRecebido = request.body;
        try {
            const setting = await createSettingService.execute(objRecebido);
            reply.send(setting);
        }
        catch (error) {
            //@ts-ignore
            reply.status(400).send({ message: error.message });
        }
    }
}
export { ListSettingsController, GetSettingByIdController, DeleteSettingsController, CreateSettingController, DeleteSettingsDetailController };
