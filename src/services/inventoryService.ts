import {
  Movimentacao,
  OrigemMovimentacao,
  ProductInventory,
  RelatorioFaturamento,
  TipoMovimentacao,
} from "../types/inventory";
import { Product } from "../types/product";

import { admin } from "../lib/firebase";

export class AddFromInventoryService {
  async execute(collection: string, obj: any) {
    const snapshot = await admin
      .firestore()
      .collection(collection)
      .add({
        ...obj,
      });
    return { id: snapshot.id };
  }
}

export class SetFromInventoryService {
  async execute(collection: string, data: ProductInventory, merge = false) {
    const docRef = admin.firestore().collection(collection).doc(data.id);
    await docRef.set(data, { merge }); // merge: true → não sobrescreve campos não informados
    return { success: true, message: `Documento  salvo com sucesso.` };
  }
}

export class GetByIdFromInventoryService {
  async execute(collection: string, ean: string): Promise<ProductInventory> {
    const querySnapshot = await admin
      .firestore()
      .collection(collection)
      .where("gtin", "==", Number(ean))
      .get();

    // Se não encontrou
    if (querySnapshot.empty) {
    }
    const foundDoc = querySnapshot.docs[0];
    return { id: foundDoc.id, ...foundDoc.data() } as ProductInventory;
  }
}

export class adminInventory {
  async adicionarProduto(ean: string) {
    const serviceInventory = new AddFromInventoryService();
    const querySnapshotProduct = await admin
      .firestore()
      .collection("webProduct")
      .where("gtin", "==", Number(ean))
      .get();
    if (querySnapshotProduct.empty) throw new Error("Produto não encontrado");
    const foundDocProduct = querySnapshotProduct.docs[0];
    const resp: Product = {
      id: foundDocProduct.id,
      ...foundDocProduct.data(),
    } as Product;
    const produto = {
      idInterno: `${resp.gtin}` || ean,
      idProduct: `${resp.id}`,
      gtin: `${resp.gtin}` || ean,
      description: resp.description || "Sem descrição",
      totalReal: 0,
      reservado: 0,
      faturado: 0,
      transito: 0,
      disponivel: 0,
      bloqueado: 0,
      retorno: 0,
      inventario: 0,
    };
    const querySnapshot = await admin
      .firestore()
      .collection("webInventory")
      .where("gtin", "==", ean)
      .get();
    // Se não encontrou
    if (querySnapshot.empty) {
      const resp = await serviceInventory.execute("webInventory", {
        ...produto,
      });
      if (resp) {
        return resp;
      }
    }
    const foundDoc = querySnapshot.docs[0];
    return { id: foundDoc.id, ...foundDoc.data() };
  }
  async getByInventoryId(ean: string) {
    const querySnapshot = await admin
      .firestore()
      .collection("webInventory")
      .where("gtin", "==", ean)
      .get();
    // Se não encontrou
    if (querySnapshot.empty) throw new Error("Produto sem estoque");

    const foundDoc = querySnapshot.docs[0];
    return { id: foundDoc.id, ...foundDoc.data() };
  }
  private async registrarMovimentacaoInterna(
    produto: ProductInventory,
    tipo: TipoMovimentacao,
    quantidade: number,
    data: Date,
    extras?: {
      origem?: OrigemMovimentacao;
      referenciaPedido?: string;
      observacao?: string;
    }
  ) {
    const movimentacao: Movimentacao = {
      // id: crypto.randomUUID(),
      produtoId: produto.gtin,
      tipo,
      quantidade,
      data,
      ...extras,
    };

    const serviceInventory = new AddFromInventoryService();
    await serviceInventory.execute("webMovimento", {
      ...movimentacao,
    });
  }
  async registrarMovimentacao(
    gtin: string,
    tipo: TipoMovimentacao,
    quantidade: number,
    data: Date = new Date(),
    extras?: {
      origem?: OrigemMovimentacao;
      referenciaPedido?: string;
      observacao?: string;
    }
  ) {
    const inventorySet = new SetFromInventoryService();

    let querySnapshot = await admin
      .firestore()
      .collection("webInventory")
      .where("gtin", "==", gtin)
      .get();

    // Se não encontrou, tenta adicionar
    if (querySnapshot.empty) {
      await this.adicionarProduto(gtin);
      querySnapshot = await admin
        .firestore()
        .collection("webInventory")
        .where("gtin", "==", gtin)
        .get();
    }

    const foundDoc = querySnapshot.docs[0];
    const produtoInventory = {
      id: foundDoc.id,
      ...foundDoc.data(),
    } as ProductInventory;

    if (!produtoInventory)
      throw new Error("Produto não encontrado no inventário");

    // Clonar os valores atuais
    const atualizado: ProductInventory = { ...produtoInventory };

    switch (tipo) {
      case "entrada":
      case "devolucao":
      case "ajuste":
        atualizado.totalReal = (produtoInventory.totalReal || 0) + quantidade;
        break;

      case "reserva": {
        const disponivel =
          atualizado.totalReal -
          (atualizado.reservado +
            atualizado.faturado +
            atualizado.transito +
            atualizado.bloqueado +
            atualizado.retorno);
        if (disponivel < quantidade) {
          throw new Error(
            `Estoque disponível insuficiente para ${produtoInventory.gtin}`
          );
        }
        atualizado.reservado = (produtoInventory.reservado || 0) + quantidade;
        break;
      }

      case "faturamento":
        if ((produtoInventory.reservado || 0) < quantidade) {
          throw new Error("Estoque reservado insuficiente para faturamento");
        }
        atualizado.reservado = produtoInventory.reservado - quantidade;
        atualizado.faturado = (produtoInventory.faturado || 0) + quantidade;
        atualizado.totalReal = produtoInventory.totalReal - quantidade;
        break;

      case "transito":
        if (produtoInventory.totalReal < quantidade) {
          throw new Error("Estoque insuficiente para transito");
        }
        atualizado.transito = (produtoInventory.transito || 0) + quantidade;
        break;

      case "bloqueio":
        if (produtoInventory.totalReal < quantidade) {
          throw new Error("Estoque insuficiente para bloqueio");
        }
        if (produtoInventory.disponivel < quantidade) {
          throw new Error("Estoque insuficiente para bloqueio");
        }
        atualizado.bloqueado = (produtoInventory.bloqueado || 0) + quantidade;
        break;
      case "desbloqueio":
        if (produtoInventory.bloqueado < quantidade) {
          throw new Error("Saldo insuficiente para desbloqueio");
        }
        atualizado.bloqueado = (produtoInventory.bloqueado || 0) - quantidade;
        break;

      case "retorno":
        atualizado.retorno = (produtoInventory.retorno || 0) + quantidade;
        break;

      case "retorno_entrada":
        if (produtoInventory.retorno < quantidade) {
          throw new Error("Saldo insuficiente entrada inventario");
        }
        atualizado.retorno = (produtoInventory.retorno || 0) + quantidade;
        atualizado.retorno = (produtoInventory.retorno || 0) - quantidade;
        atualizado.totalReal = produtoInventory.totalReal + quantidade;
        break;

      case "retorno_saida":
        if (produtoInventory.retorno < quantidade) {
          throw new Error("Saldo insuficiente para retorno");
        }
        atualizado.retorno = (produtoInventory.retorno || 0) - quantidade;
        break;

      case "inventario":
        atualizado.inventario = (produtoInventory.inventario || 0) + quantidade;
        break;

      case "inventario_entrada":
        if (produtoInventory.inventario < quantidade) {
          throw new Error("Saldo insuficiente entrada inventario");
        }
        atualizado.inventario = (produtoInventory.inventario || 0) + quantidade;
        atualizado.inventario = (produtoInventory.inventario || 0) - quantidade;
        atualizado.totalReal = produtoInventory.totalReal + quantidade;
        break;
      case "inventario_saida":
        if (produtoInventory.inventario < quantidade) {
          throw new Error("Saldo insuficiente saida inventario");
        }
        atualizado.inventario = (produtoInventory.inventario || 0) - quantidade;
        break;

      case "saida":
      case "transferencia":
        if (produtoInventory.totalReal < quantidade) {
          throw new Error("Saldo insuficiente para " + tipo);
        }
        atualizado.totalReal = produtoInventory.totalReal - quantidade;

        break;

      default:
        throw new Error("Tipo de movimentação inválido");
    }

    // Atualiza campo 'disponivel'
    atualizado.disponivel =
      atualizado.totalReal -
      (atualizado.reservado +
        atualizado.faturado +
        atualizado.transito +
        atualizado.bloqueado);
    //  atualizado.disponivel = await this.consultarDisponivel(produtoId);
    // Salvar no Firestore
    await inventorySet.execute("webInventory", atualizado, true);

    // Registrar movimentação no histórico
    await this.registrarMovimentacaoInterna(
      atualizado,
      tipo,
      quantidade,
      data,
      extras
    );

    return {
      success: true,
      message: `Movimentação de ${tipo} registrada com sucesso para o produto ${produtoInventory.gtin}`,
    };
  }
  async consultarDisponivel(ean: string): Promise<number> {
    const querySnapshot = await admin
      .firestore()
      .collection("webInventory")
      .where("gtin", "==", ean)
      .get();

    if (querySnapshot.empty) {
      return 0; // Ou: throw new Error("Produto não encontrado");
    }

    const foundDoc = querySnapshot.docs[0];
    const data = foundDoc.data() || {};

    const produtoInventory: ProductInventory = {
      id: foundDoc.id,
      idInterno: data.idInterno || "",
      idProduct: data.idProduct || "",
      gtin: data.gtin || ean,
      description: data.description || "",
      totalReal: Number(data.totalReal) || 0,
      reservado: Number(data.reservado) || 0,
      faturado: Number(data.faturado) || 0,
      transito: Number(data.transito) || 0,
      disponivel: Number(data.disponivel) || 0,
      bloqueado: Number(data.bloqueado) || 0,
      retorno: Number(data.retorno) || 0,
      inventario: Number(data.inventario) || 0,
    };

    const valor =
      produtoInventory.totalReal -
      (produtoInventory.reservado +
        produtoInventory.faturado +
        produtoInventory.transito +
        produtoInventory.bloqueado +
        produtoInventory.retorno);

    // return Math.max(valor, 0);
    return valor < 0 ? produtoInventory.totalReal : valor;
  }
  async getAllInventory(): Promise<ProductInventory[]> {
    const querySnapshot = await admin
      .firestore()
      .collection("webInventory")
      .get();
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ProductInventory[];
  }
  async listarMovimentacoes(filtro?: {
    produtoId?: string;
    tipo?: TipoMovimentacao;
    origem?: OrigemMovimentacao;
    de?: Date;
    ate?: Date;
  }): Promise<Movimentacao[]> {

    const snapshot = await admin.firestore().collection("webMovimento").get();
   const movimento =  snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Movimentacao[];

    return movimento.filter((m) => {
      if (filtro?.produtoId && m.produtoId !== filtro.produtoId) return false;
      if (filtro?.tipo && m.tipo !== filtro.tipo) return false;
      if (filtro?.origem && m.origem !== filtro.origem) return false;
      if (filtro?.de && m.data < filtro.de) return false;
      if (filtro?.ate && m.data > filtro.ate) return false;
      return true;
    });
  }
  registrarVendaSite(gtin: string, qtd: number, pedidoId: string) {
    this.registrarMovimentacao(gtin, "reserva", qtd, new Date(), {
      origem: "site",
      referenciaPedido: pedidoId,
      observacao: "Reserva de venda no site",
    });
  }
  registrarVendaPDV(gtin: string, qtd: number, pedidoId: string) {
    this.registrarMovimentacao(gtin, "reserva", qtd, new Date(), {
      origem: "pdv",
      referenciaPedido: pedidoId,
      observacao: "Reserva de venda no PDV",
    });
  }
  faturarVenda(gtin: string, qtd: number, pedidoId: string) {
    this.registrarMovimentacao(gtin, "faturamento", qtd, new Date(), {
      origem: "sistema",
      referenciaPedido: pedidoId,
      observacao: "Faturamento de pedido",
    });
  }
  retornarProduto(gtin: string, quantidade: number, pedidoId: string) {
    this.registrarMovimentacao(
      gtin,
      "retorno_entrada",
      quantidade,
      new Date(),
      {
        origem: "sistema",
        referenciaPedido: pedidoId,
        observacao: "Produto devolvido após venda",
      }
    );
  }
  async fecharFaturamento(gtin: string): Promise<RelatorioFaturamento | null> {
    let querySnapshotProduct = await admin
      .firestore()
      .collection("webInventory")
      .where("gtin", "==", gtin)
      .get();

    const foundDoc = querySnapshotProduct.docs[0];
    const produto = {
      id: foundDoc.id,
      ...foundDoc.data(),
    } as ProductInventory;

    const quantidade = produto.faturado;

    if (quantidade > 0) {
      if (produto.totalReal < quantidade) {
        throw new Error("Saldo insuficiente para baixar o faturado");
      }

      produto.totalReal -= quantidade;

      this.registrarMovimentacaoInterna(
        produto,
        "saida",
        quantidade,
        new Date(),
        {
          origem: "sistema",
          observacao: "Baixa final do faturamento",
        }
      );

      produto.faturado = 0;

      return {
        produtoId: produto.id,
        nome: produto.description || "Produto sem descrição",
        quantidadeBaixada: quantidade,
        data: new Date(),
        observacao: "Faturamento finalizado e baixado do estoque",
      };
    }

    return null;
  }

  async fecharTodosFaturamentos(): Promise<RelatorioFaturamento[]> {
    const relatorios: RelatorioFaturamento[] = [];

    const querySnapshot = await admin
      .firestore()
      .collection("webInventory")
      .get();
    const produtos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ProductInventory[];

    for (const produto of produtos) {
      const relatorio = await this.fecharFaturamento(produto.id);
      if (relatorio) {
        relatorios.push(relatorio);
      }
    }

    return relatorios;
  }
}
