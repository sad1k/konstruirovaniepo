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
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'ecommerce',
      entities: [Cart, CartItem],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Cart, CartItem]),
    HttpModule,
  ],
  controllers: [CartController],
  providers: [CartService, CartTokenValidator],
})
export class CartModule {} 