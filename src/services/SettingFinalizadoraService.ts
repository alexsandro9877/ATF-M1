// import { PrismaClient } from "@prisma/client";
// import { IFinalizadora } from "../types/types";

// const prismaClient = new PrismaClient();

// class CreateUpdateFinalizadoraService {
//   async execute(data: IFinalizadora[]) {
    
//     // Validação: certifique-se de que `cod_finalizadora` não é null

//     try {
//       data.forEach(async (newObj)=>{  
//          if (newObj.cod_int_sap_sim === null) {
//       throw new Error(
//         "cod_int_sap_sim é obrigatório para criar/atualizar uma finalizadora."
//       );
//     }
//       const finalizadora = await prismaClient.finalizadora.upsert({
//         where: {
//           id: newObj.id ?? -1,
//         },
//         create: {
//           cod_int_sap_sim: newObj.cod_int_sap_sim,
//           cod_rede: newObj.cod_rede?.toString() ?? null,
//           desc_rede: newObj.desc_rede,
//           cod_bandeira: newObj.cod_bandeira?.toString() ?? null,
//           desc_bandeira: newObj.desc_bandeira,
//           // data_cadastro: new Date(newObj.data_cadastro),
//           // data_ultima_modificacao: new Date(newObj.data_ultima_modificacao),
//           user_id_mod: newObj.user_id_mod,
//           desc_finalizadora: newObj.desc_finalizadora ?? "",
//           cod_finalizadora: newObj.cod_finalizadora ?? 0,
//           tipo_crtl: newObj.tipo_crtl,
//           ind_status: newObj.ind_status,
//         },
//         update: {
//           cod_rede: newObj.cod_rede?.toString() ?? null,
//           desc_rede: newObj.desc_rede,
//           cod_bandeira: newObj.cod_bandeira?.toString() ?? null,
//           desc_bandeira: newObj.desc_bandeira,
//           // data_cadastro: new Date(newObj.data_cadastro),
//           // data_ultima_modificacao: new Date(newObj.data_ultima_modificacao),
//           user_id_mod: newObj.user_id_mod,
//           desc_finalizadora: newObj.desc_finalizadora ?? "",
//           cod_finalizadora: newObj.cod_finalizadora ?? 0,
//           tipo_crtl: newObj.tipo_crtl,
//           ind_status: newObj.ind_status,
//         },
//       });

//       return finalizadora;
//        });
//     } catch (error: any) {
//       console.error("Erro ao criar/atualizar a finalizadora:", error);
//       throw new Error(
//         `Erro ao criar/atualizar a finalizadora: ${error.message}`
//       );
//     }
   
//   }
// }

// class GetFinalizadoraService {
//   // Buscar todas as finalizadoras
//   async findAll() {
//     try {
//       const finalizadoras = await prismaClient.finalizadora.findMany({
//         orderBy: {
//           cod_int_sap_sim: "asc",
//         },
//       });
//       return finalizadoras;
//     } catch (error: any) {
//       console.error("Erro ao buscar finalizadoras:", error);
//       throw new Error(`Erro ao buscar finalizadoras: ${error.message}`);
//     }
//   }

//   // Buscar uma finalizadora específica por ID
//   async findById(id: number) {
//     try {
//       if (!id || isNaN(id)) {
//         throw new Error("ID inválido ou não fornecido.");
//       }

//       // Verifica se o SettingBase existe
//       const finalizadora = await prismaClient.finalizadora.findUnique({
//         where: {
//           id: id,
//         },
//       });
//       if (!finalizadora) {
//         throw new Error(`Finalizadora com ID ${id} não encontrada.`);
//       }

//       return finalizadora;
//     } catch (error: any) {
//       console.error("Erro ao buscar finalizadora por ID:", error);
//       throw new Error(`Erro ao buscar finalizadora por ID: ${error.message}`);
//     }
//   }
// }


// class DeleteByIdFinalizadoraService {
//     async execute(id: number) {
//         if (!id) {
//             throw new Error("ID não fornecido.");
//         }

//         try {
//             // Verifica se o SettingBase existe
//             const Finalizadora = await prismaClient.finalizadora.findUnique({
//                 where: {
//                     id: id,
//                 }
//             });

//             if (!Finalizadora) {
//                 throw new Error(`Finalizadora ID ${id} não encontrada.`);
//             }
//             // Exclui o registro principal na tabela SettingBase
//             await prismaClient.finalizadora.delete({
//                 where: {
//                     id: id,
//                 },
//             });

//             return { message: `Finalizadora ${id} e seus registros relacionados foram deletados com sucesso!` };
//         } catch (error) {
//             throw new Error(`Erro ao deletar a configuração: ${error.message}`);
//         }
//     }
// }


// export { CreateUpdateFinalizadoraService, GetFinalizadoraService,DeleteByIdFinalizadoraService };
