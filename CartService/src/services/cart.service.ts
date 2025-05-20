import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { AddItemDto } from '../dto/add-item.dto';
import { RemoveItemDto } from '../dto/remove-item.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private readonly httpService: HttpService,
  ) {}

  async addItem(addItemDto: AddItemDto): Promise<Cart> {
    // Check product availability first
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:3003/products/${addItemDto.productId}`)
      );
      const product = response.data;
      
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      
      if (product.stock < addItemDto.quantity) {
        throw new BadRequestException('Insufficient stock');
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new NotFoundException('Product not available');
    }

    // Find or create cart
    let cart = await this.cartRepository.findOne({
      where: { userId: addItemDto.userId },
      relations: ['items'],
    });

    if (!cart) {
      cart = await this.cartRepository.save({
        userId: addItemDto.userId,
        items: [],
      });
    }

    // Find existing item
    const existingItem = cart.items.find(
      item => item.productId === addItemDto.productId
    );

    if (existingItem) {
      // Update existing item
      const updatedItem = await this.cartItemRepository.findOne({
        where: { id: existingItem.id }
      });
      if (updatedItem) {
        updatedItem.quantity += addItemDto.quantity;
        await this.cartItemRepository.save(updatedItem);
      }
    } else {
      // Create new item
      const newItem = this.cartItemRepository.create({
        productId: addItemDto.productId,
        quantity: addItemDto.quantity,
        cart,
      });
      await this.cartItemRepository.save(newItem);
    }

    // Return updated cart
    return this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items'],
    });
  }

  async removeItem(removeItemDto: RemoveItemDto): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { userId: removeItemDto.userId },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    // Find the item to remove
    const itemToRemove = cart.items.find(
      item => item.productId === removeItemDto.productId
    );

    if (itemToRemove) {
      // Remove the item
      await this.cartItemRepository.delete(itemToRemove.id);
    }

    // Return updated cart
    return this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items'],
    });
  }
} 