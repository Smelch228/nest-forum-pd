import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashService } from '../hash/hash.service';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly usersService: UsersService,
  ) {}

  async signIn(dto: SignInDto) {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await this.hashService.compareBcrypt(
      dto.password,
      user.passwordHash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { token: 'token...' };
  }
}
