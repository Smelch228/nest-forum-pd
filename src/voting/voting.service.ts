import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VotableType } from '../common/enums/votable-type.enum';
import { VoteDto } from './dto/vote.dto';

@Injectable()
export class VotingService {
  constructor(private readonly prisma: PrismaService) {}

  async vote(voteDto: VoteDto, userId: number) {
    try {
      // Проверка существования поста или комментария
      if (voteDto.votableType === VotableType.POST) {
        const postExists = await this.prisma.post.findUnique({
          where: { id: voteDto.votableId },
        });
        if (!postExists) {
          throw new NotFoundException(
            `Post with ID ${voteDto.votableId} not found`,
          );
        }
      } else if (voteDto.votableType === VotableType.COMMENT) {
        const commentExists = await this.prisma.comment.findUnique({
          where: { id: voteDto.votableId },
        });
        if (!commentExists) {
          throw new NotFoundException(
            `Comment with ID ${voteDto.votableId} not found`,
          );
        }
      }

      // Проверка существующего голоса
      const existingVote = await this.prisma.vote.findFirst({
        where: {
          userId,
          votableId: voteDto.votableId,
          votableType: voteDto.votableType,
        },
      });

      if (existingVote) {
        return await this.prisma.vote.update({
          where: { id: existingVote.id },
          data: { upvote: voteDto.upvote },
        });
      } else {
        return await this.prisma.vote.create({
          data: {
            userId,
            votableId: voteDto.votableId,
            votableType: voteDto.votableType,
            upvote: voteDto.upvote,
          },
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Error in voting: ' + error.message,
      );
    }
  }

  async removeVote(
    userId: number,
    votableId: number,
    votableType: VotableType,
  ) {
    try {
      await this.prisma.vote.deleteMany({
        where: {
          userId,
          votableId,
          votableType,
        },
      });
      return { message: `Vote has been removed` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error in removing vote: ${error.message}`,
      );
    }
  }

  async countVotes(votableId: number, votableType: VotableType) {
    try {
      const votes = await this.prisma.vote.groupBy({
        by: ['upvote'],
        where: { votableId, votableType },
        _count: {
          upvote: true,
        },
      });

      let upvotes = 0;
      let downvotes = 0;

      votes.forEach((vote) => {
        if (vote.upvote) {
          upvotes = vote._count.upvote;
        } else {
          downvotes = vote._count.upvote;
        }
      });

      const totalVotes = upvotes - downvotes;

      return { upvotes, downvotes, totalVotes };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error in counting votes: ' + error.message,
      );
    }
  }
}
