import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BcryptModule } from '../crypto/crypto.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [PrismaModule, BcryptModule, RedisModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
