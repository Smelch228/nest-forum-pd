import { ConflictException, Injectable } from '@nestjs/common';
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

    return this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash: await this.hashService.hashBcrypt(dto.password),
        email: dto.email,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findFirst({ where: { username } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
