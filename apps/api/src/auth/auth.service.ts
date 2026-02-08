import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import bcrypt from 'bcryptjs';

type PublicUser = {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  createdAt: Date;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private signToken(userId: string) {
    return this.jwt.sign({ sub: userId });
  }

  async register(dto: { email: string; username: string; password: string; displayName?: string }) {
    const email = dto.email.toLowerCase().trim();
    const username = dto.username.trim();
    const displayName = dto.displayName?.trim() || null;

    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (exists) throw new BadRequestException('Email or username already taken');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: { email, username, passwordHash, displayName },
      select: { id: true, email: true, username: true, displayName: true, createdAt: true },
    });

    return {
      token: this.signToken(user.id),
      user,
    };
  }

  async login(dto: { email: string; password: string }) {
    const email = dto.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email },
      // важно: нужен hash
      select: { id: true, email: true, username: true, displayName: true, createdAt: true, passwordHash: true },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const publicUser: PublicUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      createdAt: user.createdAt,
    };

    return {
      token: this.signToken(user.id),
      user: publicUser,
    };
  }
}
