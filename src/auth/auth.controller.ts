import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    return await this.usersService.create(dto);
  }

  @Post('sign-in')
  async singIn(@Body() dto: SignInDto) {
    return await this.authService.signIn(dto);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    await this.authService.logout(req.headers.authorization, req.user.id);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard)
  @Post('logout-all')
  async logoutAll(@Req() req) {
    await this.authService.logoutAllSessions(req.user.id);
    return { message: 'Logged out from all sessions' };
  }
}
