import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CartTokenValidator {
  constructor(private readonly httpService: HttpService) {}

  async validate(token: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://auth-service/validate-token', { token })
      );
      return response.data;
    } catch (error) {
      return false;
    }
  }
} 