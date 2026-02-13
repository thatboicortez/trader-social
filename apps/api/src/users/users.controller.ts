import { Body, Controller, Patch, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";
import { UpdateMeDto } from "./dto/update-me.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @UseGuards(AuthGuard("jwt"))
  @Patch("me")
  updateMe(@Req() req: any, @Body() dto: UpdateMeDto) {
    const userId = req.user?.userId ?? req.user?.sub;
    return this.users.updateMe(userId, dto);
  }
}