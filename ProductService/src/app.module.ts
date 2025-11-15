import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product.module';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'ecommerce',
      entities: [Product, Category],
      synchronize: true, // Set to false in production
      autoLoadEntities: true,
      logging: true,
      ssl: false,
    }),
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {} 