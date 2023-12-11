import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { VotingModule } from '../voting/voting.module';
import { RedisModule } from '../redis/redis.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [PrismaModule, VotingModule, RedisModule, CommentModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
