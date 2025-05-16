import { Controller, Post, Get, Body, Param, UseGuards, Request, UnauthorizedException, Logger } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderTokenValidator } from './order-token.validator';

@Controller('orders')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly tokenValidator: OrderTokenValidator,
  ) {}

  @Post()
  async createOrder(@Request() req, @Body() createOrderDto: { items: { productId: string; quantity: number; price: number }[] }) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    this.logger.debug(`Validating token for order creation`);
    const validationResult = await this.tokenValidator.validate(token);
    this.logger.debug(`Token validation result: ${JSON.stringify(validationResult)}`);

    if (!validationResult.valid || !validationResult.user) {
      throw new UnauthorizedException('Invalid token');
    }

    this.logger.debug(`Creating order for user: ${validationResult.user.id}`);
    return this.orderService.createOrder(validationResult.user.id, createOrderDto.items);
  }

  @Get(':id/status')
  async getOrderStatus(@Param('id') id: string) {
    return this.orderService.getOrderStatus(id);
  }

  @Get('user')
  async getUserOrders(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    this.logger.debug(`Validating token for getting user orders`);
    const validationResult = await this.tokenValidator.validate(token);
    this.logger.debug(`Token validation result: ${JSON.stringify(validationResult)}`);

    if (!validationResult.valid || !validationResult.user) {
      throw new UnauthorizedException('Invalid token');
    }

    this.logger.debug(`Getting orders for user: ${validationResult.user.id}`);
    return this.orderService.getUserOrders(validationResult.user.id);
  }
} 