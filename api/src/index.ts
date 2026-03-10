import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import orderRoutes from './Routes/OrderRoutes';
import { swaggerSpec } from './Config/swagger';
import { authMiddleware, generateToken } from './Middlewares/auth';

dotenv.config();

//instanciando o servidor express
const app = express();

app.use(express.json());

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check da API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API está funcionando
 */
// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Gera um token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 */
// Rota de login para gerar token
app.post('/login', (req, res) => {
  const { username } = req.body;
  const token = generateToken(username || 'api-user');
  res.status(200).json({ 
    token,
    message: 'Use este token no header: Authorization: Bearer <token>'
  });
});

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas de pedidos (protegidas por autenticação)
app.use('/order', authMiddleware, orderRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
});
