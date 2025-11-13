import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { CartTokenValidator } from './services/cart-token-validator.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'ecommerce',
      entities: [Cart, CartItem],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Cart, CartItem]),
    HttpModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartTokenValidator],
})
export class CartModule {} 