import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductRepository } from '../repositories/product.repository';
import { CategoryService } from './category.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
  ) {}

  async getProducts(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['category'],
    });
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    // Check if category exists before creating the product
    const categoryExists = await this.categoryService.checkIfExists(createProductDto.categoryId);
    if (!categoryExists) {
      throw new BadRequestException(`Category with ID ${createProductDto.categoryId} does not exist`);
    }
    
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.getProductById(id);
    product.stock = quantity;
    return this.productRepository.save(product);
  }

  async deleteProduct(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
} 