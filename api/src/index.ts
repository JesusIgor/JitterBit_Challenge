import express from 'express';
import dotenv from 'dotenv';
import orderRoutes from './Routes/OrderRoutes';

dotenv.config();

//instanciando o servidor express
const app = express();

app.use(express.json());

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Rotas de pedidos
app.use('/order', orderRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
