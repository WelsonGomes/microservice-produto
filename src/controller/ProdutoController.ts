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

async function baixarEstoqueProduto(id: number, qtdaVenda: number, op: string) {
    try {
        const result = await prisma.$transaction(async (prismaTransaction) => {
            const produto = await prismaTransaction.produto.findUnique({ where: { id: id } });
            if (!produto) {
                console.error(`Produto com ID ${id} não encontrado.`);
                return { success: false, msg: 'Produto não encontrado' };
            }
            console.log(`Produto encontrado: ${JSON.stringify(produto)}`);
            console.log(`Quantidade atual do produto: ${produto.qtdade}`);
            console.log(`Quantidade da venda: ${qtdaVenda}`);
            console.log(`Operação: ${op}`);

            let novaQtd = 0;

            if (op === 'soma') {
                novaQtd = produto.qtdade + qtdaVenda;
            } else if (op === 'subtrair') {
                novaQtd = produto.qtdade - qtdaVenda;
            } else {
                console.error(`Operação inválida: ${op}`);
                return { success: false, msg: 'Operação inválida' };
            }

            console.log(`Nova quantidade calculada: ${novaQtd}`);

            if (novaQtd < 0) {
                console.error(`Quantidade insuficiente para venda. Estoque disponível: ${produto.qtdade}, Quantidade solicitada: ${qtdaVenda}`);
                return { success: false, msg: 'Quantidade insuficiente' };
            }
        
            await prismaTransaction.produto.update({
                where: { id: id },
                data: { qtdade: novaQtd }
            });
        
            console.log(`Estoque do produto com ID ${id} atualizado com sucesso. Nova quantidade: ${novaQtd}`);
            return { success: true, msg: 'Estoque atualizado', novoEstoque: novaQtd };
        });
    
        return result;
    } catch (error) {
        console.error('Erro ao atualizar o estoque do produto:', error);
        return { success: false, msg: 'Erro interno ao processar a solicitação' };
    } finally {
        await prisma.$disconnect();
    }
};

export { createProduto, deleteProduto, selectProduto, baixarEstoqueProduto }