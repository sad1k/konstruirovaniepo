import { Controller, Post, Delete, Body, Headers, UseGuards } from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { CartTokenValidator } from '../services/cart-token-validator.service';
import { AddItemDto } from '../dto/add-item.dto';
import { RemoveItemDto } from '../dto/remove-item.dto';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly tokenValidator: CartTokenValidator,
  ) {}

  @Post('add')
  async addItem(
    @Headers('authorization') token: string,
    @Body() addItemDto: AddItemDto,
  ) {
    const isValid = await this.tokenValidator.validate(token);
    if (!isValid) {
      throw new Error('Invalid token');
    }
    return this.cartService.addItem(addItemDto);
  }

  @Delete('remove')
  async removeItem(
    @Headers('authorization') token: string,
    @Body() removeItemDto: RemoveItemDto,
  ) {
    const isValid = await this.tokenValidator.validate(token);
    if (!isValid) {
      throw new Error('Invalid token');
    }
    return this.cartService.removeItem(removeItemDto);
  }
} 