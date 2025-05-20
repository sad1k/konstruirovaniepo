import { Controller, Post, Delete, Body, Headers, UseGuards, UnauthorizedException } from '@nestjs/common';
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
    @Headers('authorization') authHeader: string,
    @Body() addItemDto: AddItemDto,
  ) {
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const isValid = await this.tokenValidator.validate(token);
    if (!isValid) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.cartService.addItem(addItemDto);
  }

  @Post('remove')
  @Delete('remove')
  async removeItem(
    @Headers('authorization') authHeader: string,
    @Body() removeItemDto: RemoveItemDto,
  ) {
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const isValid = await this.tokenValidator.validate(token);
    if (!isValid) {
      throw new UnauthorizedException('Invalid token');
    }
    return this.cartService.removeItem(removeItemDto);
  }
} 