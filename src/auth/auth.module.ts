import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { BcryptModule } from '../crypto/crypto.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [UsersModule, BcryptModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
