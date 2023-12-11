import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { VotingService } from '../voting/voting.service';
import { VotableType } from '../common/enums/votable-type.enum';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { PageDto } from '../common/dto/page.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly votingService: VotingService,
  ) {}
  async create(createCommentDto: CreateCommentDto, userId: number) {
    try {
      return await this.prisma.comment.create({
        data: { ...createCommentDto, userId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error in creating comment: ' + error.message,
      );
    }
  }

  async getCommentsByPostId(postId: number, pageOptionsDto: PageOptionsDto) {
    const sortOrder = pageOptionsDto.order === 'ASC' ? 'asc' : 'desc';
    try {
      const comments = await this.prisma.comment.findMany({
        where: { postId },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        orderBy: { createdAt: sortOrder },
        include: {
          user: true,
          parentComment: {
            include: {
              user: true,
            },
          },
        },
      });

      const commentsCount = await this.prisma.comment.count({
        where: { postId },
      });

      // Добавляем информацию о голосах и форматируем ответы
      const commentsWithVotesAndFormattedReplies = await Promise.all(
        comments.map(async (comment) => {
          const votes = await this.votingService.countVotes(
            comment.id,
            VotableType.COMMENT,
          );

          let formattedContent = comment.content;
          if (comment.parentCommentId && comment.parentComment) {
            const parentUsername = comment.parentComment.user.username;
            formattedContent = `Ответ на комментарий пользователя ${parentUsername}: '${comment.parentComment.content}'. ${formattedContent}`;
          }

          return {
            ...comment,
            content: formattedContent,
            votes,
            user: this.safeUserData(comment.user),
            parentComment: comment.parentComment
              ? {
                  ...comment.parentComment,
                  user: this.safeUserData(comment.parentComment.user),
                }
              : null,
          };
        }),
      );

      const pageMetaDto = new PageMetaDto({
        itemCount: commentsCount,
        pageOptionsDto,
      });

      return new PageDto(commentsWithVotesAndFormattedReplies, pageMetaDto);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error in retrieving comments: ' + error.message,
      );
    }
  }

  async findAll() {
    return `This action returns all comment`;
  }

  async findOne(id: number) {
    return await this.prisma.comment.findUnique({ where: { id } });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    try {
      return await this.prisma.comment.update({
        where: { id },
        data: { ...updateCommentDto },
      });
    } catch (error) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    return await this.prisma.comment.delete({ where: { id } });
  }

  private safeUserData = (user) => {
    return {
      // id: user.id,
      username: user.username,
    };
  };
}
