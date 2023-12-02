import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BcryptModule } from './crypto/crypto.module';
import { RedisModule } from './redis/redis.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { CategoryModule } from './category/category.module';
import { VotingModule } from './voting/voting.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    BcryptModule,
    RedisModule,
    PostModule,
    CommentModule,
    CategoryModule,
    VotingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
