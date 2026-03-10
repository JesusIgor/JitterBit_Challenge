// Payload que a api recebe da requisição 
export interface CreateOrderRequest {
  numeroPedido: string;
  valorTotal: number;
  dataCriacao: string;
  items: Array<{
    idItem: string;
    quantidadeItem: number;
    valorItem: number;
  }>;
}

// DTO para o formato do banco de dados
export interface OrderDTO {
  orderId: string;
  value: number;
  creationDate: Date;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
  }>;
}

// Classe de mapeamento entre os formatos
export class OrderMapper {
  // Converte a request em DTO para salvar no banco
  static toDB(data: CreateOrderRequest): OrderDTO {
    return {
      orderId: data.numeroPedido,
      value: data.valorTotal,
      creationDate: new Date(data.dataCriacao),
      items: data.items.map(item => ({
        productId: Number(item.idItem),
        quantity: item.quantidadeItem,
        price: item.valorItem,
      })),
    };
  }

  // retorna o formato da resposta da API a partir do formato do banco
  static toResponse(order: any) {
    return {
      orderId: order.orderId,
      value: Number(order.value),
      creationDate: order.creationDate,
      items: order.items?.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price),
      })) || [],
    };
  }
}
