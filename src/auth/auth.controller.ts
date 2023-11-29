import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    return await this.usersService.create(dto);
  }

  @Post('sign-in')
  async singIn(@Body() dto: SignInDto) {
    return await this.authService.signIn(dto);
  }

  //TODO: добавить guard и получать userId из request(переделать параметры функции)
  @Post('logout')
  async logout(@Body() dto: { token: string; userId: string }) {
    await this.authService.logout(dto.token, dto.userId);
    return { message: 'Logged out successfully' };
  }

  //TODO: добавить guard и получать userId из request(переделать параметры функции)
  @Post('logout-all')
  async logoutAll(@Body() dto: { userId: string }) {
    await this.authService.logoutAllSessions(dto.userId);
    return { message: 'Logged out from all sessions' };
  }
}
