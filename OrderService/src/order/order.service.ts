import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(userId: string, items: { quantity: number; price: number }[]): Promise<Order> {
    this.logger.debug(`Creating order for user ${userId} with ${items.length} items`);
    
    // Create and save the order first
    const order = new Order();
    order.userId = userId;
    order.status = 'PENDING';
    order.total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const savedOrder = await this.orderRepository.save(order);
    this.logger.debug(`Saved order with id: ${savedOrder.id}`);

    // Create and save order items
    const orderItems = items.map(item => {
      const orderItem = new OrderItem();
      orderItem.quantity = item.quantity;
      orderItem.price = item.price;
      orderItem.order = savedOrder;
      return orderItem;
    });

    // Save all order items
    await this.orderItemRepository.save(orderItems);
    this.logger.debug(`Saved ${orderItems.length} order items`);

    // Return the complete order with items
    return this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items']
    });
  }

  async getOrderStatus(orderId: string): Promise<string> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error('Order not found');
    }
    return order.status;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = status;
    return this.orderRepository.save(order);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items'],
    });
  }
} 