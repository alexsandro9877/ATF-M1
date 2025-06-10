import { PrismaClient } from '@prisma/client';
const prismaClient = new PrismaClient();
class ListSettingService {
    async execute() {
        try {
            const settings = await prismaClient.settingBase.findMany({
                include: {
                    settings: true
                }
            });
            if (settings.length === 0) {
                return ({ message: "Sem contas cadastradas" });
            }
            return settings;
        }
        catch (error) {
            throw new Error("Erro ao listar as contas: " + error);
        }
    }
}
class GetSettingByIdService {
    async execute(id) {
        if (!id) {
            throw new Error("ID não fornecido.");
        }
        try {
            const settings = await prismaClient.settingBase.findUnique({
                where: {
                    cod_base: id
                }
            });
            if (!settings) {
                throw new Error("configurações ID fornecido, não encontrada.");
            }
            return settings;
        }
        catch (error) {
            throw new Error(`${error}`);
        }
    }
}
class DeleteSettingsService {
    async execute(id) {
        if (!id) {
            throw new Error("ID não fornecido.");
        }
        try {
            // Verifica se o SettingBase existe
            const settingBase = await prismaClient.settingBase.findUnique({
                where: {
                    cod_base: id,
                },
                include: {
                    settings: true,
                },
            });
            if (!settingBase) {
                throw new Error(`Configuração com ID ${id} não encontrada.`);
            }
            // Exclui todos os registros relacionados na tabela Settings
            if (settingBase.settings && settingBase.settings.length > 0) {
                await prismaClient.settings.deleteMany({
                    where: {
                        cod_base: id, // Exclui todos os Settings com o mesmo cod_base
                    },
                });
            }
            // Exclui o registro principal na tabela SettingBase
            await prismaClient.settingBase.delete({
                where: {
                    cod_base: id,
                },
            });
            // await prismaClient.$transaction([
            //     prismaClient.settings.deleteMany({ where: { cod_base: id } }),
            //     prismaClient.settingBase.delete({ where: { cod_base: id } }),
            // ]);
            return { message: `Configuração com ID ${id} e seus registros relacionados foram deletados com sucesso!` };
        }
        catch (error) {
            throw new Error(`Erro ao deletar a configuração: ${error.message}`);
        }
    }
}
class DeleteSettingsDetailService {
    async execute(id) {
        try {
            await prismaClient.$transaction([
                prismaClient.settings.deleteMany({ where: { id: id } })
            ]);
            return { message: `ID ${id} e seus registros foram deletados com sucesso!` };
        }
        catch (error) {
            throw new Error(`Erro ao deletar a configuração: ${error.message}`);
        }
    }
}
class CreateUpdateSettingService {
    async execute(settingData) {
        const newObj = settingData[0];
        // Validação básica
        if (!newObj.name || !newObj.desc_grupo || !newObj.description) {
            throw new Error("Por favor, forneça todos os campos necessários: name, desc_grupo, description.");
        }
        try {
            // Cria ou atualiza o SettingBase
            const settingBase = await prismaClient.settingBase.upsert({
                where: {
                    cod_base: newObj.cod_base || -1, // Usamos -1 para garantir que não exista um registro com esse cod_base
                },
                create: {
                    name: newObj.name,
                    desc_grupo: newObj.desc_grupo,
                    desc_subgrupo: newObj.desc_subgrupo,
                    description: newObj.description,
                    state: newObj.state || "",
                },
                update: {
                    name: newObj.name,
                    desc_grupo: newObj.desc_grupo,
                    desc_subgrupo: newObj.desc_subgrupo,
                    description: newObj.description,
                    state: newObj.state || "",
                },
            });
            // Se houver settings relacionados, cria ou atualiza eles
            if (newObj.settings && newObj.settings.length > 0) {
                for (const setting of newObj.settings) {
                    await prismaClient.settings.upsert({
                        where: {
                            id: setting.id || -1 // Relaciona com o SettingBase criado/acima
                        },
                        create: {
                            cod_base: settingBase.cod_base,
                            name: setting.name,
                            id: setting.id,
                            description: setting.description,
                            state: setting.state || true,
                        },
                        update: {
                            cod_base: newObj.cod_base || -1,
                            name: setting.name,
                            description: setting.description,
                            state: setting.state || true,
                        },
                    });
                }
            }
            return settingBase;
        }
        catch (error) {
            console.error("Erro ao criar/atualizar a configuração:", error);
            throw new Error(`Erro ao criar/atualizar a configuração: ${error.message}`);
        }
    }
}
export { ListSettingService, GetSettingByIdService, DeleteSettingsService, CreateUpdateSettingService, DeleteSettingsDetailService };
