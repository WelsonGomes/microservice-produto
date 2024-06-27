import { Decimal } from "@prisma/client/runtime/library";

export interface ProdutoDTO {
    nome: string;
    descricao: string;
    qtdade: number;
    valor: Decimal;
}

export interface reqProdutoDTO {
    nome: string;
    descricao: string;
    qtdade: number;
    valor: Decimal;
}