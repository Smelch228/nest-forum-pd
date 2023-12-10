import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { VotingService } from '../voting/voting.service';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { PageDto } from '../common/dto/page.dto';

//TODO: Создай пагинацию и фильтрацию, плюс внедри счётчик голосов.
@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly votingService: VotingService,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    try {
      return await this.prisma.post.create({
        data: { ...createPostDto, userId },
      });
    } catch (error) {
      throw new Error('Error in creating post: ' + error.message);
    }
  }

  async findAll(pageOptionsDto: PageOptionsDto, categoryId?: number) {
    const sortOrder = pageOptionsDto.order === 'ASC' ? 'asc' : 'desc';
    const whereCondition = categoryId ? { categoryId } : {};
    const posts = await this.prisma.post.findMany({
      where: whereCondition,
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
      orderBy: { createdAt: sortOrder },
    });
    const postsCount = await this.prisma.post.count({
      where: whereCondition,
    });
    const pageMetaDto = new PageMetaDto({
      itemCount: postsCount,
      pageOptionsDto,
    });

    return new PageDto(posts, pageMetaDto);
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
    try {
      return await this.prisma.post.update({
        where: { id },
        data: { ...updatePostDto, userId },
      });
    } catch (error) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }

  async remove(id: number, userId: number) {
    const post = await this.findOne(id);

    if (post.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this post',
      );
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return `Post with ID ${id} was deleted`;
  }
}
