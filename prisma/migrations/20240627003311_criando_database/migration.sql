-- CreateTable
CREATE TABLE "tbproduto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "qtdade" INTEGER NOT NULL,
    "valor" DECIMAL(17,2) NOT NULL,

    CONSTRAINT "tbproduto_pkey" PRIMARY KEY ("id")
);
