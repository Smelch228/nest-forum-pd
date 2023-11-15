import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { HashModule } from '../hash/hash.module';

@Module({
  imports: [UsersModule, HashModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
