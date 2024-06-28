import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { baixarEstoqueProduto, createProduto, deleteProduto, selectProduto } from './controller/ProdutoController'

dotenv.config();

const app = express();
app.use(cors({origin:"*"}));
app.use(express.json());
const port = process.env.SERVICE_PORT;

app.post('/Produto', async (req: Request, res: Response) => {
    try{
        console.log(req.body);
        const produto = req.body;
        const response = await createProduto(produto);
    return res.status(response.status).json({msg:response.msg});
    } catch (error){
        return res.status(500).json({msg: 'Houve um erro no servidor.'});
    }
});

app.delete('/Produto', async (req: Request, res: Response) => {
    try{
        const id = req.query.id as string;
        const response = await deleteProduto(parseInt(id));
        return res.status(response.status).json({msg:response.msg});
    } catch (error){
        return res.status(500).json({msg: 'Houve um erro no servidor.'});
    }
});

app.get('/Produto', async (req: Request, res: Response) => {
    try{
        const id = req.query.id as string;
        const response = await selectProduto(parseInt(id));
        return res.status(200).json(response);
    } catch (error){
        return res.status(500).json({msg: 'Houve um erro no servidor.'});
    }
});

app.put('/Produto', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.body.id as string);
        const qtd = parseInt(req.body.qtd as string);
        const op = req.body.op as string;

        if (isNaN(id) || isNaN(qtd)) {
        return res.status(400).json({ success: false, msg: 'Parâmetros inválidos' });
        }
  
        const response = await baixarEstoqueProduto(id, qtd, op);
        console.log('Estoque Atualizado API');
      
        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        console.error('Erro na rota /Produto:', error);
        return res.status(500).json({ success: false, msg: 'Erro interno ao processar a solicitação' });
    }
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});