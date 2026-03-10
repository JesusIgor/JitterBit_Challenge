import { Request, Response } from 'express';
import prisma from '../Config/prisma';
import { OrderMapper, CreateOrderRequest } from '../Mappers/OrderMapper';

export class OrderController {
  
  // POST /order - Criar novo pedido
  static async create(req: Request, res: Response): Promise<void> {
    try {
      // Pega os dados da request
      const requestData: CreateOrderRequest = req.body;

      // Valida se os dados obrigatórios foram enviados
      if (!requestData.numeroPedido || !requestData.valorTotal || !requestData.dataCriacao) {
        res.status(400).json({
          error: 'Campos obrigatórios faltando: numeroPedido, valorTotal, dataCriacao',
        });
        return;
      }

      // Mapeia para o formato do banco de dados
      const orderData = OrderMapper.toDB(requestData);

      // Cria o pedido no banco com seus itens
      const order = await prisma.order.create({
        data: {
          orderId: orderData.orderId,
          value: orderData.value,
          creationDate: orderData.creationDate,
          items: {
            create: orderData.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Retorna o pedido criado no formato esperado
      res.status(201).json(OrderMapper.toResponse(order));
    } catch (error: any) {
      console.error('Erro ao criar pedido:', error);
      res.status(500).json({
        error: 'Erro ao criar pedido',
        message: error.message,
      });
    }
  }

  // GET /order/:orderId - Obter pedido por ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const orderId = String(req.params.orderId);

      // Busca o pedido no banco de dados
      const order = await prisma.order.findUnique({
        where: { orderId },
        include: { items: true },
      });

      // Se não encontrar o pedido
      if (!order) {
        res.status(404).json({
          error: `Pedido com ID ${orderId} não encontrado`,
        });
        return;
      }

      // Retorna o pedido no formato esperado
      res.status(200).json(OrderMapper.toResponse(order));
    } catch (error: any) {
      console.error('Erro ao buscar pedido:', error);
      res.status(500).json({
        error: 'Erro ao buscar pedido',
        message: error.message,
      });
    }
  }

  // GET /order/list - Listar todos os pedidos
  static async list(req: Request, res: Response): Promise<void> {
    try {
      // Busca todos os pedidos
      const orders = await prisma.order.findMany({
        include: { items: true },
      });

      // Mapeia cada pedido para o formato esperado
      const response = orders.map(order => OrderMapper.toResponse(order));

      res.status(200).json(response);
    } catch (error: any) {
      console.error('Erro ao listar pedidos:', error);
      res.status(500).json({
        error: 'Erro ao listar pedidos',
        message: error.message,
      });
    }
  }

  // PUT /order/:orderId - Atualizar pedido
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const orderId = String(req.params.orderId);
      const requestData = req.body;

      // Verifica se o pedido existe
      const existingOrder = await prisma.order.findUnique({
        where: { orderId },
      });

      if (!existingOrder) {
        res.status(404).json({
          error: `Pedido com ID ${orderId} não encontrado`,
        });
        return;
      }

      // Atualiza o pedido
      const updatedOrder = await prisma.order.update({
        where: { orderId },
        data: {
          value: requestData.valorTotal || existingOrder.value,
          creationDate: requestData.dataCriacao ? new Date(requestData.dataCriacao) : existingOrder.creationDate,
        },
        include: { items: true },
      });

      // Se enviar novos itens, deleta os antigos e cria os novos
      if (requestData.items && requestData.items.length > 0) {
        await prisma.items.deleteMany({
          where: { orderId },
        });

        await prisma.items.createMany({
          data: requestData.items.map((item: any) => ({
            orderId,
            productId: Number(item.idItem),
            quantity: item.quantidadeItem,
            price: item.valorItem,
          })),
        });
      }

      // Busca o pedido atualizado com os itens
      const finalOrder = await prisma.order.findUnique({
        where: { orderId },
        include: { items: true },
      });

      res.status(200).json(OrderMapper.toResponse(finalOrder));
    } catch (error: any) {
      console.error('Erro ao atualizar pedido:', error);
      res.status(500).json({
        error: 'Erro ao atualizar pedido',
        message: error.message,
      });
    }
  }

  // DELETE /order/:orderId - Deletar pedido
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const orderId = String(req.params.orderId);

      // Verifica se o pedido existe
      const order = await prisma.order.findUnique({
        where: { orderId },
      });

      if (!order) {
        res.status(404).json({
          error: `Pedido com ID ${orderId} não encontrado`,
        });
        return;
      }

      // Deleta o pedido (os itens serão deletados em cascata)
      await prisma.order.delete({
        where: { orderId },
      });

      res.status(200).json({
        message: `Pedido ${orderId} deletado com sucesso`,
      });
    } catch (error: any) {
      console.error('Erro ao deletar pedido:', error);
      res.status(500).json({
        error: 'Erro ao deletar pedido',
        message: error.message,
      });
    }
  }
}
