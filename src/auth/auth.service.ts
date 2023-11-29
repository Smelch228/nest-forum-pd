import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CryptoService } from '../crypto/crypto.service';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { RedisService } from '../redis/redis.service';
import { USER_TOKENS_KEY } from '../common/redis-keys.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: CryptoService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {}

  async signIn(dto: SignInDto) {
    const user = await this.validateUser(dto);
    const token = await this.hashService.generateUUID();

    await this.addToken(token, user.id.toString());
    return { token, userId: user.id };
  }

  async logout(currentToken: string, userId: string) {
    const userTokensKey = USER_TOKENS_KEY(userId);
    await this.redisService.remFromSet(userTokensKey, currentToken);
    await this.redisService.delete(currentToken);
  }

  async logoutAllSessions(userId: string): Promise<void> {
    await this.removeAllTokens(userId);
  }
  private async addToken(token: string, userId: string) {
    const userTokensKey = USER_TOKENS_KEY(userId);

    await this.redisService.addWithEx(token, 300, userId);
    await this.redisService.addToSet(userTokensKey, token);
  }

  private async validateUser(dto: SignInDto) {
    const user = dto.email
      ? await this.usersService.findByEmail(dto.email)
      : await this.usersService.findByUsername(dto.username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await this.hashService.compareBcrypt(
      dto.password,
      user.passwordHash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private async removeAllTokens(userId: string) {
    const userTokensKey = USER_TOKENS_KEY(userId);
    const tokens = await this.redisService.getSetMembers(userTokensKey);

    if (tokens.length > 0) {
      await this.redisService.delete(...tokens);
    }
    await this.redisService.delete(userTokensKey);
  }
}
