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
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'ecommerce',
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