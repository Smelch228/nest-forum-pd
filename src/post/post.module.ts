import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { VotingModule } from '../voting/voting.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [PrismaModule, VotingModule, RedisModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
