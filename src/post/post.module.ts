import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { VotingModule } from '../voting/voting.module';

@Module({
  imports: [PrismaModule, VotingModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
