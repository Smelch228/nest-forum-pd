import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { Observable } from 'rxjs';
import { USER_TOKENS_KEY } from '../redis-keys.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    return this.validateToken(token, request);
  }

  private extractToken(request): string | null {
    const authToken = request.headers.authorization;
    if (!authToken) return null;

    return authToken;
  }

  private async validateToken(token: string, request): Promise<boolean> {
    const userData = await this.redisService.client.hgetall(token);
    if (!userData || !userData.userId) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const userTokensKey = USER_TOKENS_KEY(userData.userId);
    const activeTokens = await this.redisService.client.smembers(userTokensKey);
    if (!activeTokens.includes(token)) {
      throw new UnauthorizedException('Token is no longer active');
    }

    request.user = { id: userData.userId, role: userData.role };

    return true;
  }
}
