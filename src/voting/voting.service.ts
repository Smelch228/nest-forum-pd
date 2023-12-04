import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VotableType } from '../common/enums/votable-type.enum';

@Injectable()
export class VotingService {
  constructor(private readonly prisma: PrismaService) {}

  async vote(
    userId: number,
    votableId: number,
    votableType: VotableType,
    upvote: boolean,
  ) {
    try {
      const existingVote = await this.prisma.vote.findFirst({
        where: {
          userId,
          votableId,
          votableType,
        },
      });

      if (existingVote) {
        return await this.prisma.vote.update({
          where: { id: existingVote.id },
          data: { upvote },
        });
      } else {
        return await this.prisma.vote.create({
          data: {
            userId,
            votableId,
            votableType,
            upvote,
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
      return await this.prisma.vote.groupBy({
        by: ['upvote'],
        where: { votableId, votableType },
        _count: {
          upvote: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error in counting votes: ' + error.message,
      );
    }
  }
}
