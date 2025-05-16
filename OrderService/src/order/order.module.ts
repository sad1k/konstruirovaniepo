import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderTokenValidator } from './order-token.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    HttpModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderTokenValidator],
  exports: [OrderService],
})
export class OrderModule {} 