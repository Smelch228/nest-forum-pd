import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { PageDto } from '../common/dto/page.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findFirst({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new BadRequestException(
        `Category with name '${createCategoryDto.name}' already exists`,
      );
    }

    try {
      return await this.prisma.category.create({
        data: createCategoryDto,
      });
    } catch (error) {
      throw new BadRequestException('Error creating category');
    }
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const sortOrder = pageOptionsDto.order === 'ASC' ? 'asc' : 'desc';
    const categories = await this.prisma.category.findMany({
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
      orderBy: { createdAt: sortOrder },
    });
    const categoriesCount = await this.prisma.category.count();
    const pageMetaDto = new PageMetaDto({
      itemCount: categoriesCount,
      pageOptionsDto,
    });
    return new PageDto(categories, pageMetaDto);
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.category.delete({
        where: { id },
      });
      return `Category with ID ${id} was deleted`;
    } catch (error) {
      throw new NotFoundException(
        `Category with ID ${id} not found or could not be deleted`,
      );
    }
  }
}
