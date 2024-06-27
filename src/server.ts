import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createProduto } from './controller/ProdutoController'

dotenv.config();

const app = express();
app.use(cors({origin:"*"}));
app.use(express.json());
const port = process.env.SERVICE_PORT;

app.post('/', async (req, res) => {
    const produto = req.body;
    const response = await createProduto(produto);
    return res.status(response.status).json(response.msg);
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});