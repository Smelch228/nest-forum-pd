import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: CryptoService,
  ) {}

  async create(dto: CreateUserDto) {
    const emailExists = await this.findByEmail(dto.email);
    const usernameExists = await this.findByUsername(dto.username);

    if (emailExists || usernameExists) {
      throw new ConflictException('Email or username already exist');
    }

    try {
      return this.prisma.user.create({
        data: {
          username: dto.username,
          passwordHash: await this.hashService.hashBcrypt(dto.password),
          email: dto.email,
        },
      });
    } catch (error) {
      throw new BadRequestException('Error creating user');
    }
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with provided email not found`);
    }
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findFirst({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with provided username not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return `User with ID ${id} was deleted`;
    } catch (error) {
      throw new NotFoundException(
        `User with ID ${id} not found or could not be deleted`,
      );
    }
  }
}
