import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { VotingService } from '../voting/voting.service';

//TODO: Создай пагинацию и фильтрацию, плюс внедри счётчик голосов.
@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly votingService: VotingService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    try {
      return await this.prisma.post.create({
        data: createPostDto,
      });
    } catch (error) {
      throw new Error('Error in creating post: ' + error.message);
    }
  }

  async findAll() {
    await this.prisma.post.findMany();
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

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      return await this.prisma.post.update({
        where: { id },
        data: updatePostDto,
      });
    } catch (error) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.post.delete({
        where: { id },
      });
      return `Post with ID ${id} was deleted`;
    } catch (error) {
      throw new NotFoundException(
        `Post with ID ${id} not found or could not be deleted`,
      );
    }
  }
}
