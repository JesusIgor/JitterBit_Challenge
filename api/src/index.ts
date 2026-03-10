import express from 'express';
import dotenv from 'dotenv';


dotenv.config();

//instanciando o servidor express
const app = express();

app.use(express.json());


app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
