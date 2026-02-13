import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateMeDto } from "./dto/update-me.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async updateMe(userId: string, dto: UpdateMeDto) {
    if (!userId) throw new BadRequestException("Missing userId");

    const displayName = dto.displayName?.trim();
    const bio = dto.bio?.trim();

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(displayName !== undefined ? { displayName } : {}),
        ...(bio !== undefined ? { bio } : {}),
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        bio: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
  }
}