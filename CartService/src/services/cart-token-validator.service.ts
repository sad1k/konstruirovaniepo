import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CartTokenValidator {
  constructor(private readonly httpService: HttpService) {}

  async validate(token: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3000/auth/validate-token', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      );
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }
} 