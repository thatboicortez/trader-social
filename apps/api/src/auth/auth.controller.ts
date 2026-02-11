import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

@Post('login')
login(@Body() dto: LoginDto) {
  return this.authService.login(dto);
}

  @Post('verify')
  verify(@Body() dto: VerifyDto) {
    return this.authService.verifyEmail(dto);
  }
}