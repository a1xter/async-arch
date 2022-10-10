import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UserInterface } from './interfaces/user.interface';

@Controller('api/v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<UserInterface> {
    return await this.authService.createUser(createUserDto);
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    return await this.authService.signIn(signInDto);
  }

  @UseGuards(AuthGuard())
  @Post('test')
  get() {
    return 'success';
  }
}
