import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({origin:"*"}));
app.use(express.json());

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});