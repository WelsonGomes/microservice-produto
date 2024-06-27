import { ProdutoDTO, reqProdutoDTO } from '../model/Interface';
import prisma from '../conn/Prisma';

async function createProduto(produto: ProdutoDTO): Promise<{status: number, msg: string}> {
    try {
        const result = await prisma.$transaction(async (prismaTransaction) => {
            await prismaTransaction.produto.create({ data: produto });
            return {status: 200, msg: 'Novo produto cadastrado com sucesso.'};
        });
        return result;
    } catch (error) {
        console.log(error);
        return {status: 400, msg: 'Houve uma falha ao cadastrar o produto.'};
    } finally {
        await prisma.$disconnect();
    }
};

async function deleteProduto(id: number): Promise<{status: number, msg: string}> {
    try {
        const result = await prisma.$transaction(async (prismaTransaction) => {
            await prismaTransaction.produto.delete({ where: { id: id} });
            return {status: 200, msg: 'Produto deletado com sucesso.'};
        });
        return result;
    } catch (error) {
        console.log(error);
        return {status: 400, msg: 'Houve uma falha ao deletar o produto.'};
    } finally {
        await prisma.$disconnect();
    }
};

async function selectProduto(id: number): Promise<reqProdutoDTO[] | reqProdutoDTO> {
    try {
        if(id > 0){
            const response = await prisma.produto.findUnique({ where: { id: id }});
            if(!response){
                return [];
            }
            const produto: reqProdutoDTO = {
                id: response.id,
                nome: response.nome,
                descricao: response.descricao,
                qtdade: response.qtdade,
                valor: response.valor
            };
            return produto;
        };
        const response = await prisma.produto.findMany();
        if(!response){
            return [];
        };
        const produtos: reqProdutoDTO[] = response.map((c) => {
            return {
                id: c.id,
                nome: c.nome,
                descricao: c.descricao,
                qtdade: c.qtdade,
                valor: c.valor
            }
        });
        return produtos;
    } catch (error) {
        console.log(error);
        return [];
    } finally {
        await prisma.$disconnect();
    }
};

export { createProduto, deleteProduto, selectProduto }