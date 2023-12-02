import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { BcryptModule } from '../crypto/crypto.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [UserModule, BcryptModule, RedisModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
