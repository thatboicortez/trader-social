// apps/api/src/auth/auth.service.ts

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

import { RegisterDto } from './dto/register.dto';
import { VerifyDto } from './dto/verify.dto';
import { LoginDto } from './dto/login.dto';

function normalizeEmail(email: string) {
  return (email || '').trim().toLowerCase();
}

function generate6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly email: EmailService,
  ) {}

  // REGISTER: создаёт пользователя + шлёт код на почту
  async register(dto: RegisterDto) {
    const email = normalizeEmail(dto.email);
    const username = (dto.username || '').trim();
    const password = (dto.password || '').trim();

    if (!email) throw new BadRequestException('Email is required');
    if (!username) throw new BadRequestException('Username is required');
    if (!password) throw new BadRequestException('Password is required');

    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
      select: { id: true, email: true, username: true },
    });

    if (existing?.email === email) throw new BadRequestException('Email already in use');
    if (existing?.username === username) throw new BadRequestException('Username already in use');

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        displayName: username,
        isEmailVerified: false,
      },
      select: { id: true },
    });

    // удалим старые коды (на всякий случай)
    await this.prisma.emailVerification.deleteMany({ where: { email } });

    const code = generate6DigitCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.emailVerification.create({
      data: { email, codeHash, expiresAt },
    });

    await this.email.sendVerificationCode({ to: email, code });

    return { ok: true, userId: user.id };
  }

  // RESEND CODE: если юзер уже есть, но не verified — шлём новый код
  async resendVerificationCode(emailRaw: string) {
    const email = normalizeEmail(emailRaw);
    if (!email) throw new BadRequestException('Email is required');

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, isEmailVerified: true },
    });

    if (!user) throw new BadRequestException('User not found');
    if (user.isEmailVerified) return { ok: true }; // уже верифицирован — нечего слать

    await this.prisma.emailVerification.deleteMany({ where: { email } });

    const code = generate6DigitCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.emailVerification.create({
      data: { email, codeHash, expiresAt },
    });

    await this.email.sendVerificationCode({ to: email, code });

    return { ok: true };
  }

  // VERIFY: проверяет код и помечает юзера verified
  async verifyEmail(dto: VerifyDto) {
    const email = normalizeEmail(dto.email);
    const code = (dto.code || '').trim();

    if (!email) throw new BadRequestException('Email is required');
    if (!code) throw new BadRequestException('Code is required');

    const record = await this.prisma.emailVerification.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) throw new BadRequestException('No verification code found');
    if (record.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Verification code expired');
    }

    const ok = await bcrypt.compare(code, record.codeHash);
    if (!ok) throw new BadRequestException('Invalid verification code');

    await this.prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    });

    await this.prisma.emailVerification.deleteMany({ where: { email } });

    return { ok: true };
  }

  // LOGIN: выдаёт accessToken
  async login(dto: LoginDto) {
    const email = normalizeEmail(dto.email);
    const password = (dto.password || '').trim();

    if (!email) throw new BadRequestException('Email is required');
    if (!password) throw new BadRequestException('Password is required');

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true, isEmailVerified: true },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // если хочешь запретить логин без верификации — включи:
    // if (!user.isEmailVerified) throw new UnauthorizedException('Email not verified');

    const accessToken = this.jwt.sign({ sub: user.id });
    return { accessToken };
  }
}