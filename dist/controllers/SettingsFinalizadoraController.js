import { CreateUpdateFinalizadoraService, GetFinalizadoraService, DeleteByIdFinalizadoraService } from '../services/SettingFinalizadoraService';
class FinalizadoraController {
    async handle(req, res) {
        const data = req.body;
        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).send({ error: 'O corpo da requisição deve ser um array com pelo menos um objeto.' });
        }
        try {
            const service = new CreateUpdateFinalizadoraService();
            const result = await service.execute(data);
            return res.status(200).send(result);
        }
        catch (error) {
            return res.status(500).send({ error: error.message });
        }
    }
}
class getAllFinalizadorasController {
    async handle(request, reply) {
        const getFinalizadoraService = new GetFinalizadoraService();
        try {
            const result = await getFinalizadoraService.findAll();
            reply.send(result);
        }
        catch (error) {
            //@ts-ignore
            reply.status(500).send({ message: error.message });
        }
    }
}
class getByIdFinalizadorasController {
    async handle(request, reply) {
        const getFinalizadoraService = new GetFinalizadoraService();
        const { id } = request.params;
        try {
            const result = await getFinalizadoraService.findById(parseInt(id));
            reply.send(result);
        }
        catch (error) {
            //@ts-ignore
            reply.status(500).send({ message: error.message });
        }
    }
}
class deleteByIdFinalizadorasController {
    async handle(request, reply) {
        const deleteByIdFinalizadoraService = new DeleteByIdFinalizadoraService();
        const { id } = request.params;
        try {
            const result = await deleteByIdFinalizadoraService.execute(parseInt(id));
            reply.send(result);
        }
        catch (error) {
            //@ts-ignore
            reply.status(500).send({ message: error.message });
        }
    }
}
export { FinalizadoraController, getAllFinalizadorasController, getByIdFinalizadorasController, deleteByIdFinalizadorasController };
