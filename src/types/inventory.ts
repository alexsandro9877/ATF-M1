export type TipoMovimentacao =
  | "entrada"
  | "saida"
  | "ajuste"
  | "devolucao"
  | "transferencia"
  | "reserva"
  | "faturamento"
  | "transito"
  | "bloqueio"
  | "desbloqueio"
  | "inventario"
  | "inventario_entrada"
  | "inventario_saida"
  | "retorno"
  | "retorno_entrada"
  | "retorno_saida";

export type OrigemMovimentacao = "site" | "pdv" | "sistema" | "outros";

export interface RelatorioFaturamento {
  produtoId: string;
  nome: string;
  quantidadeBaixada: number;
  data: Date;
  observacao: string;
}

export interface Movimentacao {
  id?: string;
  produtoId: string;
  gtin?: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  data: Date;
  origem?: OrigemMovimentacao;
  referenciaPedido?: string;
  observacao?: string;
}

export interface ProductInventory {
  id: string ;
  gtin: string;
  idInterno: string;
  idProduct:string;
  description?: string;
  totalReal: number;
  reservado: number;
  disponivel: number;
  faturado: number;
  transito: number;
  bloqueado: number;
  retorno: number;
  inventario: number;
}