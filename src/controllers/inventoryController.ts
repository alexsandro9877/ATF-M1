import { FastifyReply, FastifyRequest } from "fastify";
import { adminInventory } from "../services/inventoryService";
import { OrigemMovimentacao, TipoMovimentacao } from "../types/inventory";

export class addByInventoryProductController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { ean } = request.body as { ean: string };
    const serviceInventory = new adminInventory();
    if (!ean) {
      reply.status(400).send({ message: "EAN é obrigatório" });
      return;
    }
    try {
      const resp = await serviceInventory.adicionarProduto(ean);
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}
export class getAllByInventoryProductController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const serviceInventory = new adminInventory();
  
    try {
      const resp = await serviceInventory.getAllInventory();
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}
export class getAllByInventoryProductMovimentoController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const serviceInventory = new adminInventory();
      const  dados  = request.body as {  produtoId: string,
      tipo: string,
      origem: string,
      de: string,
      ate: string};
    
    try {
      const resp = await serviceInventory.listarMovimentacoes({
        produtoId: dados.produtoId,
        tipo: dados.tipo as TipoMovimentacao, 
        origem: dados.origem as OrigemMovimentacao,
        de: dados.de ? new Date(dados.de) : undefined,
        ate: dados.ate ? new Date(dados.ate) : undefined,
        });
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}
export class addByInventoryProductMovimentoController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const contdd = request.body as {
      gtin: string;
      tipo: TipoMovimentacao;
      quantidade: number;
      data: string;
      extras?: {
        origem?: OrigemMovimentacao;
        referenciaPedido?: string;
        observacao?: string;
      };
    };
    const serviceInventory = new adminInventory();
    if (contdd.gtin === "") {
      reply.status(400).send({ message: "Produto é obrigatório" });
      return;
    }
    try {
      const resp = await serviceInventory.registrarMovimentacao(contdd.gtin, contdd.tipo, contdd.quantidade, new Date(contdd.data), contdd.extras);
      reply.status(200).send(resp);
    } catch (error) {
      //@ts-ignore
      reply.status(500).send({ message: error.message });
    }
  }
}
