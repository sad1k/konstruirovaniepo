import { Injectable } from '@nestjs/common';
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
    let cart = await this.cartRepository.findOne({
      where: { userId: addItemDto.userId },
    });

    if (!cart) {
      cart = this.cartRepository.create({
        userId: addItemDto.userId,
        items: [],
      });
    }

    // Check product availability
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://product-service/products/${addItemDto.productId}`)
      );
      const product = response.data;
      
      if (product.stock < addItemDto.quantity) {
        throw new Error('Insufficient stock');
      }
    } catch (error) {
      throw new Error('Product not available');
    }

    const existingItem = cart.items.find(
      item => item.productId === addItemDto.productId
    );

    if (existingItem) {
      existingItem.quantity += addItemDto.quantity;
    } else {
      const newItem = this.cartItemRepository.create({
        productId: addItemDto.productId,
        quantity: addItemDto.quantity,
        cart,
      });
      cart.items.push(newItem);
    }

    return this.cartRepository.save(cart);
  }

  async removeItem(removeItemDto: RemoveItemDto): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { userId: removeItemDto.userId },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(
      item => item.productId !== removeItemDto.productId
    );

    return this.cartRepository.save(cart);
  }
} 