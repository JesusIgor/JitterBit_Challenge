import { Router } from 'express';
import { OrderController } from '../Controllers/OrderController';

const router = Router();

//Criar novo pedido
router.post('/', OrderController.create);

// Listar todos os pedidos
router.get('/list', OrderController.list);

//Obter um pedido específico
router.get('/:orderId', OrderController.getById);

//Atualizar um pedido
router.put('/:orderId', OrderController.update);

//Deletar um pedido
router.delete('/:orderId', OrderController.delete);

export default router;
