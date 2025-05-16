import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderTokenValidator {
  private readonly logger = new Logger(OrderTokenValidator.name);

  constructor(private readonly httpService: HttpService) {}

  async validate(token: string): Promise<{ valid: boolean; user?: any }> {
    try {
      this.logger.debug(`Validating token with auth service`);
      const response = await firstValueFrom(
        this.httpService.post('http://localhost:3000/auth/validate-token', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
      );
      
      this.logger.debug(`Auth service response: ${JSON.stringify(response.data)}`);
      
      if (response.data.valid && response.data.user) {
        return {
          valid: true,
          user: response.data.user
        };
      }
      return { valid: false };
    } catch (error) {
      this.logger.error(`Token validation error: ${error.message}`);
      return { valid: false };
    }
  }
}
