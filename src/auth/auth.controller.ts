import { Body, Controller, Post, UseGuards, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../common/decorators/user.decorator';

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
  async logout(@User() user, @Headers('authorization') authHeader) {
    await this.authService.logout(authHeader, user.id);
    return { message: 'Logged out successfully', authHeader, user };
  }

  @UseGuards(AuthGuard)
  @Post('logout-all')
  async logoutAll(@User() user) {
    await this.authService.logoutAllSessions(user.id);
    return { message: 'Logged out from all sessions' };
  }
}
