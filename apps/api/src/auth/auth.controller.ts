import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { VerifyDto } from "./dto/verify.dto";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("verify")
  verify(@Body() dto: VerifyDto) {
    return this.authService.verifyEmail(dto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  me(@Req() req: any) {
    const userId = req.user?.userId ?? req.user?.sub;
    return this.authService.me(userId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch("me")
  updateMe(
    @Req() req: any,
    @Body() body: { displayName?: string; bio?: string }
  ) {
    const userId = req.user?.userId ?? req.user?.sub;
    return this.authService.updateMe(userId, body);
  }
}