import  prismaClient  from '../../prisma/prisma';
import { ISettingBaseProps } from '../types/types';


class ListSettingService {
    async execute() {
        try {
            const settings = await prismaClient.settingBase.findMany({
                include: {
                     settings: true                }
            });

            if (settings.length === 0) {
                return ({ message: "Sem configurações criadas" });
            }
            return settings;
        } catch (error) {
            throw new Error("Erro ao listar as configurações: " + error);
        }
    }
}
class GetSettingByIdService {
    async execute(id : number) {
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
        } catch (error) {
            throw new Error(`${error}`);
        }
    }
}

class DeleteSettingsService {
    async execute( id : number) {
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
                throw new Error(`Configuração com ID ${id} não encontrada.`);
            }

            await prismaClient.settingBase.delete({
                where: {
                    cod_base: id
                }
            });

            return { message: `${id} deletado com sucesso!` };
        } catch (error) {
            throw new Error(`${error}`);
        }
    }
}

class CreateSettingService {
    async execute(a : ISettingBaseProps) {
        if (!a.name || !a.cod_base || !a.desc_grupo || !a.description) {
            throw new Error("Por favor, forneça todos os campos necessários.");
        }

        try {
            const existingSettings = await prismaClient.settingBase.findFirst({
                where: {
                    cod_base: a.cod_base
                    
                }
            });

            if (existingSettings) {
                throw new Error(`A configuração com nome '${name}' e aplicação '${a.cod_base}' já existe.`);
            }

        

            const account = await prismaClient.settingBase.create({
                //@ts-ignore
                data: {
                    ...a,
                    settings: {
                        connect:  {id: a.cod_base}
                    }
                },
                include: {
                    settings: true
                }
            });

            return account;
        } catch (error) {
            //@ts-ignore
            throw new Error(`Erro ao criar a conta: ${error.message}`);
        }
    }
}

// class EditAccountsService {
//     async execute({ id, name, aplication, routes, customerId }: EditAccountsProps) {
//         if (!id || !name || !aplication || !routes || !customerId) {
//             throw new Error("Por favor, forneça todos os campos necessários.");
//         }

//         try {
//             const existingAccount = await prisma.account.findUnique({
//                 where: { id }
//             });

//             if (!existingAccount) {
//                 throw new Error(`Conta com ID ${id} não encontrada.`);
//             }

//             if (existingAccount.customerId !== customerId) {
//                 throw new Error("O customerId fornecido não corresponde ao customerId existente.");
//             }

//             const accountUpdate = {
//                 name,
//                 aplication,
//                 routes,
//                 customerId,
//                 updated_at: new Date(),
                
//             };

//             const updatedAccount = await prisma.account.update({
//                 where: { id },
//                 data: accountUpdate,
//                 include:{
//                     customer:true
//                 }
                
//             });

//             return updatedAccount;
//         } catch (error) {
//             throw new Error(`Erro ao editar a conta: ${error}`);
//         }
//     }
// }

// class GetAccountByCustomerIdService {
//     async execute(id: string) {
//         if (!id) {
//             throw new Error("ID não fornecido.");
//         }

//         try {
//             const account = await prisma.account.findMany({
//                 where: {
//                     customerId: id
//                 }
//             });

//             if (!account) {
//                 throw new Error("Conta não encontrada para o ID fornecido.");
//             }

//             return account;
//         } catch (error) {
//             throw new Error(`${error}`);
//         }
//     }
// }

export{
    ListSettingService,
    GetSettingByIdService,
    DeleteSettingsService,
    CreateSettingService
}