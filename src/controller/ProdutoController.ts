import { PrismaClient } from "@prisma/client";
import { ProdutoDTO } from '../model/Interface';
import dotenv from 'dotenv';

const prisma = new PrismaClient();
dotenv.config();

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

export { createProduto }