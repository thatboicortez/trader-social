import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodPipe } from './zod.pipe';
import { loginSchema, registerSchema } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @UsePipes(new ZodPipe(registerSchema))
  register(@Body() body: any) {
    return this.auth.register(body);
  }

  @Post('login')
  @UsePipes(new ZodPipe(loginSchema))
  login(@Body() body: any) {
    return this.auth.login(body);
  }
}
